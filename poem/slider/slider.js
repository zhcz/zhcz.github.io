var rangeSlider = function() {
    var sliders = document.querySelectorAll('.range-slider');
    sliders.forEach(function(slider,index) {
        var range = slider.querySelector('.range-slider__range');
        var value = slider.querySelector('.range-slider__value');
        // 初始化显示值
        // value.textContent = range.value;
        // 监听 input 事件
        // value.textContent = this.value;
        range.addEventListener('input', function() {
            if (index == 0) {

                
                var value = document.querySelector('.range-slider__range_margin');
                const container = document.getElementById('container');
                const imageSize = 50; // 图片宽高
                const lie = Math.ceil(dataArray.length / number);
                container.style.height = number * imageSize + Number(this.value) + 'px';
                container.style.width = lie * imageSize + Number(this.value) + 'px';
                value.textContent = '边距' + '（' + this.value + '）'
            }
            if (index == 1){
                var value = document.querySelector('.range-slider__range_radius');
                value.textContent = '圆角' + '（' + this.value + '）'
                const container = document.getElementById('container');
                container.style.borderRadius = Number(this.value) + 'px';
            }

            if (index == 2) {
                const imageContainer = document.getElementById('imageContainer');
                var value = document.querySelector('.range-slider__range_leftright');
                value.textContent = '位置' + '（' + this.value + '）'

                 // 获取当前的 left 值
                // const currentLeft = parseInt(window.getComputedStyle(imageContainer).left, 10);
                imageContainer.style.left = Number(this.value) + 'px';

            }
        });
    });
  };
  
