// uses two strategies to smooth the limited mouse input available to most computers.
// 1. cubic interpolation to estimate the intermediate curve for the spaces inbetween mouse inputs
// 2. stabilizing existing mouse input by applying only a portion of the distance between the current and last mouse positions.


// WIP, still pretty rough
// TODO: change the algorithm to decide on a number of interpolation steps based on the distance traveled. This could be accomplished by creating a buffer the size of max interpolation steps and passing a number that describes the valid limit.
// TODO: Could interpolate the presure data as well. Currently there is noticeable change for the smooth brush, especially when pressure changes abruptly.
// TODO: Still some unsettling behavior when mouse leaves window.

var POINTER_EVENTNAME = Modernizr.testAllProps('pointerEvents') ? 'pointer' : 'mouse';
var SPEED_SCALE = 200;

//inlining
var sin = Math.sin,
  cos = Math.cos,
  abs = Math.abs,
  PI = Math.PI,
  max = Math.max,
  min = Math.min,
  sqrt = Math.sqrt,
  pow = Math.pow,
  atan2 = Math.atan2,
  random = Math.random,
  sign = Math.sign;


//class for dispatching events to attached handlers.
function ReactorEvent(name) {
  this.name = name;
  this.callbacks = [];
}
ReactorEvent.prototype.attachCallback = function (callback) {
  this.callbacks.push(callback);
}
ReactorEvent.prototype.detachCallback = function (callback) {
  this.callbacks.splice(callback, 1);
}

function Reactor(eventNames) {
  this.events = {};
  for (var i = 0, ii = eventNames.length; i < ii; i++) {
    var eventName = eventNames[i];
    this.events[eventName] = new ReactorEvent(eventName);
  }
}
Reactor.prototype.dispatchEvent = function (eventName, eventArgs) {
  var callbacks = this.events[eventName].callbacks;
  for (var i = 0, ii = callbacks.length; i < ii; i++) {
    var callback = callbacks[i];
    if (callback) callback(eventArgs);
    else callbacks.splice(1, 1);
  }
};
Reactor.prototype.addEventListener = function (eventName, callback) {
  this.events[eventName].attachCallback(callback);
  return callback;
};
Reactor.prototype.removeEventListener = function (eventName, callback) {
  this.events[eventName].detachCallback(callback);
};

//used to maintain the mouse path buffer
function rotateArray(arr, step) {
  var offset = 0;
  var copy = arr.concat();
  for (var i = 0, ii = arr.length; i < ii; i++) {
    if (i + step < ii) {
      arr[i + step] = copy[i];
      offset++;
    } else {
      arr[i - offset] = copy[i];
    }
  };
}
function SmoothPointer(context, options) {
  var self = this;

  self._steps = options['steps'] || 5;
  self._minSquaredDistance = Math.pow(options['minDistance'], 2) || 400;
  self._interpolatedPts = new Array(2 * this._steps);
  self._smoothing = 0.5;
  self.canvas = context; // 保存 canvas 引用

  var _squaredSpeed = 0;
  var _buffer = new Array(8);


  var _reactor = new Reactor(['down', 'move', 'up']);
  self.on = function (eventName, fn) {
    _reactor.addEventListener(eventName, fn);
  };
  self.off = function (eventName, fn) {
    _reactor.removeEventListener(eventName, fn);
  };


  function onPointerDown(e) {
    var rect = self.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    _buffer[0] = _buffer[2] = _buffer[4] = _buffer[6] = x;
    _buffer[1] = _buffer[3] = _buffer[5] = _buffer[7] = y;
    _reactor.dispatchEvent('down', { clientX: x, clientY: y });
    e.preventDefault();
    window.addEventListener(POINTER_EVENTNAME + 'move', onPointerMove, false);
  }

  function onPointerMove(e) {
    var rect = self.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    _squaredSpeed = abs(
      pow(x - _buffer[0], 2) + pow(y - _buffer[1], 2)
    );
    if (_squaredSpeed > self._minSquaredDistance) {
      rotateArray(_buffer, 2);
      var diffx = x - _buffer[0];
      var diffy = y - _buffer[1];
      _buffer[0] += diffx * (1 - self._smoothing);
      _buffer[1] += diffy * (1 - self._smoothing);
      _reactor.dispatchEvent('move', {
        pts: getCubicPoints(),
        squaredSpeed: _squaredSpeed,
        pressure: e.pressure || 0,
        direction: atan2(diffy, diffx) + PI
      });
    }
    e.preventDefault();
  }
  function onPointerUp(e) {
    window.removeEventListener(POINTER_EVENTNAME + 'move', onPointerMove, false);
    _reactor.dispatchEvent('up', e);
  }
  context.addEventListener(POINTER_EVENTNAME + 'down', onPointerDown, false);
  window.addEventListener(POINTER_EVENTNAME + 'up', onPointerUp, false);


  function getCubicPoints() {
    var a0, a1, a2;
    function component(t, y0, y1, y2, y3) {
      a0 = y3 - y2 - y0 + y1;
      a1 = y0 - y1 - a0;
      a2 = y2 - y0;
      return (a0 * t * t * t + a1 * t * t + a2 * t + y1);
    }

    for (var i = 0, ii = self._interpolatedPts.length; i < ii; i += 2) {
      var t = (i * .5 + .25) / (ii / 2);
      self._interpolatedPts[i] = component(t, _buffer[0], _buffer[2], _buffer[4], _buffer[6]);
      self._interpolatedPts[i + 1] = component(t, _buffer[1], _buffer[3], _buffer[5], _buffer[7]);
    }
    return self._interpolatedPts;
  }
}


// function BrushShaper ()
// {
//   could possibly pass a collection of shaper objects to the brush.
// }
// BrushShaper.prototype.isShaper = true;

//loop through image data and set the apha chaneel to appropriate value, store the image data in a _currentBrush buffer, replace drawimage with putimagedata
function drawTexture(context, img, x, y, width, height, rotation) {
  context.translate(x, y);
  context.rotate(rotation);
  context.drawImage(img, -width / 2, -height / 2, width, height);
  context.rotate(-rotation);
  context.translate(-x, -y);
};


function Brush(canvas) {
  var self = this;
  var _ctx = canvas.getContext('2d');
  self.pressureSensitivity = 0;
  self.speedSensitivity = 0;
  self.angleSensitivity = 15;
  self.minSize = 2;
  self.calligAngle = 135;
  self.erase = false;
  self.maxSize = 20;
  self.hasSymmetricalEmphasis = false;

  var _brushShapes = {
    bristles: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/695191/brush-1.png'
  };
  for (var shape in _brushShapes) {
    var img = new Image();
    img.src = _brushShapes[shape];
    _brushShapes[shape] = img;
  }
  var _tex = _brushShapes['bristles'];

  self.pointer = new SmoothPointer(canvas, {
    minDistance: 5,
    steps: 20
  });
  self.pointer.on('down', function (e) {
    if (self.erase) {
      _ctx.globalCompositeOperation = 'destination-out';
    }
    var size = self.minSize + self.pressureSensitivity * e.pressure;
    drawTexture(
      _ctx, _tex,
      e.offsetX, e.offsetY,
      size, size,
      2 * PI * random()
    );
  })
  self.pointer.on('move', function (e) {
    var s = sqrt(e.squaredSpeed);
    var diff = self.maxSize - self.minSize;
    var symm = self.hasSymmetricalEmphasis ? 2 : 1;

    var influence = max(0,
      self.speedSensitivity * s / (s + SPEED_SCALE)
      + self.pressureSensitivity * e.pressure
      + self.angleSensitivity * (
        cos((PI - e.direction + self.calligAngle) * symm) * .5 + .5
      )
    );
    var size = self.minSize + influence;

    for (var i = 0, ii = e.pts.length; i < ii; i += 2) {
      drawTexture(
        _ctx, _tex,
        e.pts[i], e.pts[i + 1],
        size, size,
        2 * PI * random()
      );
    }
  });
  self.pointer.on('up', function (e) {
    _ctx.globalCompositeOperation = 'source-over';
  });
}


function Guides(canvas, spacing, angle, color) {
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  this.angle = angle / 180 * Math.PI;
  this.spacing = spacing;
  this.color = color;
}
Guides.prototype.draw = function () {
  var ctx = this.context;
  var tempC = ctx.strokeStyle;
  ctx.strokeStyle = this.color;

  var i = 0;
  var n = this.spacing;
  var l = window.innerHeight * 2;
  var endX;
  ctx.beginPath();
  do {
    endX = i + l * Math.cos(this.angle);
    ctx.moveTo(i, 0);
    ctx.lineTo(endX, l * Math.sin(this.angle));
    i += n;
  }
  while (endX < window.innerWidth)

  ctx.stroke();
  ctx.strokeStyle = tempC;
};
Guides.prototype.clear = function () {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};


document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('art');
  var guidesCanvas = document.getElementById('guides');
  var ctx = canvas.getContext('2d');
  var brush = new Brush(canvas);
  var verticalGuides = new Guides(guidesCanvas, 40, 100, '#D2E0ED');

  // 处理触摸事件
  canvas.addEventListener('touchstart', onPointerDown, false);
  canvas.addEventListener('touchmove', onPointerMove, false);
  canvas.addEventListener('touchend', onPointerUp, false);
  

  function onPointerDown(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var x = e.touches[0].clientX - rect.left;
    var y = e.touches[0].clientY - rect.top;

    // 绘图逻辑
}

function onPointerMove(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var x = e.touches[0].clientX - rect.left;
    var y = e.touches[0].clientY - rect.top;

    // 绘图逻辑
}

function onPointerUp(e) {
    // 处理触摸结束
}

  var controls = {
    clear: function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    resizeCanvas: function () {
      canvas.width = 300; // 固定宽度
      canvas.height = 500; // 固定高度
      guidesCanvas.width = 0; // 固定宽度
      guidesCanvas.height = 0; // 固定高度

    }
  };
  controls.resizeCanvas();
  window.addEventListener('resize', function () {
    controls.resizeCanvas();
  });


  var presets = {
    "preset": "干燥&光滑",
    "remembered": {
      "圆形": {
        "0": {
          "minSize": 1,
          "erase": false,
          "pressureSensitivity": 4.749527410207946,
          "speedSensitivity": 7.017958412098302,
          "hasSymmetricalEmphasis": false,
          "angleSensitivity": 21.325614366729678
        },
        "1": {
          "_smoothing": 0.8220172776091524
        },
        "2": {
          "angle": 1.7670332431514009,
          "spacing": 40
        }
      },
      "墨水画笔": {
        "0": {
          "minSize": 0,
          "erase": false,
          "pressureSensitivity": 4.749527410207946,
          "speedSensitivity": 28.189981096408317,
          "hasSymmetricalEmphasis": false,
          "angleSensitivity": 0
        },
        "1": {
          "_smoothing": 0.33226710249824887
        },
        "2": {
          "angle": 1.6762089347367093,
          "spacing": 40
        }
      },
      "画笔脚本": {
        "0": {
          "minSize": 1,
          "erase": false,
          "pressureSensitivity": 5.505671077504729,
          "speedSensitivity": 4.749527410207946,
          "hasSymmetricalEmphasis": false,
          "angleSensitivity": 10.763483539575065
        },
        "1": {
          "_smoothing": 0.2882639755074271
        },
        "2": {
          "angle": 1.1211993513041003,
          "spacing": 40
        }
      },
      "干燥&光滑": {
        "0": {
          "minSize": 3.1498829039812644,
          "erase": false,
          "pressureSensitivity": 38.95170789163723,
          "speedSensitivity": -50,
          "hasSymmetricalEmphasis": false,
          "angleSensitivity": 0
        },
        "1": {
          "_smoothing": 0.2716327239065031
        },
        "2": {
          "angle": 1.6762089347367093,
          "spacing": 40
        }
      }
    },
    "closed": false,
    "folders": {
      "Dynamics": {
        "preset": "Default",
        "closed": false,
        "folders": {}
      },
      "Emphasis": {
        "preset": "Default",
        "closed": false,
        "folders": {}
      }
    }
  };
  var guiContainer = document.getElementById('gui_container'); // 获取容器元素
  var gui = new dat.GUI({ load: presets, width: 300 });
  gui.remember(brush, brush.pointer, verticalGuides);
  gui.domElement.style.height = '500px'; // 设置固定高度
  gui.domElement.style.padding = '15px'; // 设置固定高度

  dat.GUI.TEXT_OPEN = "设置";
  dat.GUI.TEXT_CLOSED = "关闭";

  gui.domElement.querySelector('.close-button').style.display = 'none';

  // gui.add( data, 'k', 0, 1 ); 

  gui.add(brush, 'minSize', 0, 100).name('基本尺寸');
  gui.add(brush.pointer, '_smoothing', 0, 0.95).name('稳定');
  gui.add(brush, 'erase').name('橡皮?');
  
  // document.querySelector('.close-button close-bottom').innerText = '关闭';

  guiContainer.appendChild(gui.domElement);
  
  var dynamicsFolder = gui.addFolder('动态');
  dynamicsFolder.add(brush, 'pressureSensitivity', -50, 50).name('压力敏感度');
  dynamicsFolder.add(brush, 'speedSensitivity', -50, 50).name('速度灵敏度');

  var emphasisFolder = gui.addFolder('更多');
  emphasisFolder.add(brush, 'hasSymmetricalEmphasis').name('对称?');
  emphasisFolder.add(brush, 'angleSensitivity', 0, 50).name('角度灵敏度');
  emphasisFolder.add(verticalGuides, 'angle', -Math.PI, Math.PI).name('角度').__onChange = function (val) {
    brush.calligAngle = val;
    verticalGuides.clear();
    verticalGuides.draw();
  };
  emphasisFolder.add(verticalGuides, 'spacing', 2, 100).name('水平间距').__onChange = function (val) {
    verticalGuides.clear();
    verticalGuides.draw();
  };

  gui.add(controls, 'clear').name('清空');

});


