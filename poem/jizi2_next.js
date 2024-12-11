
function hiddenEle() {
    document.addEventListener('DOMContentLoaded', function () {
        var footerMetaElement = document.querySelector('.post-footer__meta');
        if (footerMetaElement) {
            var lastChild = footerMetaElement.lastElementChild;
            if (lastChild) {
                lastChild.style.marginBottom = '0';
                lastChild.style.display = 'none';
            } else {
                console.error('No child elements found in .post-footer__meta');
            }
        } else {
            console.error('Element with class .post-footer__meta not found');
        }

        // 隐藏 .post-entry__meta 元素
        var postEntryMetaElements = document.querySelectorAll('.post-entry__meta');
        postEntryMetaElements.forEach(function (element) {
            element.style.display = 'none';
        });

        // 隐藏 .post-title__meta 元素
        var postTitleMetaElements = document.querySelectorAll('.post-title__meta');
        postTitleMetaElements.forEach(function (element) {
            element.style.display = 'none';
        });
        var footerElement = document.querySelector('.footer');
        if (footerElement) {
            var lastChild = footerElement.lastElementChild;
            if (lastChild) {
                lastChild.style.marginBottom = '0';
                lastChild.style.display = 'none';
            } else {
                console.error('No child elements found in .post-footer__meta');
            }
        } else {
            console.error('Element with class .post-footer__meta not found');
        }
    });
}
function setupUI() {
    hiddenEle()
    mi_setupUI()
    color_setupUI()
    setting_setupUI()
    change_setupUI()
    defaultUI()
}
function defaultUI() {
    var elements = document.querySelector('.post-title__text');
    elements.textContent = '集字'
    var img = document.getElementById('backButton');
    img.addEventListener('click', function () {
        window.history.back()
    });
    // document.getElementById('button4').addEventListener('click', frame_openModal);
    localStorage.setItem('dict_className', "danzi");
}
function initData(num) {


    var currentPage = 1;
    var pageSize = 10;
    number = num
    const inputText = localStorage.getItem('jiziInputContent');
    const cleanedText = retainChineseEnglishAndNumbers(inputText)
    const characters = cleanedText.split(''); // 分割成单个字符数组
    requestKey(handleData2)
    function retainChineseEnglishAndNumbers(text) {
        const regex = /[^\u4e00-\u9fa5a-zA-Z0-9]/g;
        return text.replace(regex, '');
    }
    function handleData2(data) {
        data.forEach(function (object) {
            key = object.get('name')
            requestZidianDict2(currentPage, pageSize, characters, handleData)
        })
    }
    function handleData(dataArr) {
        dataArray = dataArr
        var loading = document.querySelector('.loading');
        loading.style.display = 'none';
        renderImages(dataArr, num)
    }
    function renderImages(dataArr, n) {
        const imageContainer = document.getElementById('imageContainer');
        const container = document.getElementById('container');

        const imageSize = 50; // 图片宽高
        let currentRow = 0
        const lie = Math.ceil(dataArr.length / num);
        imageContainer.style.height = n * imageSize + 'px';
        imageContainer.style.width = lie * imageSize + 'px';

        container.style.height = n * imageSize + 50 + 'px';
        container.style.width = lie * imageSize + 50 + 'px';
        for (let i = 0; i < dataArr.length; i++) {
            const imgBg = document.createElement('div');
            imgBg.classList.add("imgBg");
            const lie = Math.floor(i / num);
            if (currentRow > num - 1) {
                currentRow = 0
            }
            imgBg.style.top = `${currentRow * 50}px`;
            imgBg.style.right = `${lie * 50}px`;
            currentRow++
            imageContainer.appendChild(imgBg);

            const img = document.createElement('img');
            let ob = dataArr[i];

            img.style.position = 'absolute';
            if (ob != null) {
                setImgData(img, ob)
                img.title = ob.get('name');
                imgBg.appendChild(img);
            } else {

                const title = document.createElement('div');
                title.classList.add("title");
                title.style.position = 'absolute';
                title.textContent = characters[i];
                title.style.height = '50px';
                title.style.width = '50px';
                title.style.alignContent = 'center';
                title.style.fontSize = '35px';
                title.style.color = 'black';
                imgBg.appendChild(title);
            }

            const mi = document.createElement('img');
            mi.classList.add("mizige");
            mi.id = 'mizige'
            mi.style.display = 'none';
            mi.src = 'images/mc1.png';
            imgBg.appendChild(mi)

            // 添加双击事件监听器
            img.addEventListener('click', function () {
                // alert('图片被双击了！');
                currentImg = img
                currentImgIndex = i
                // alert('图片被长按了！');
                // 在这里添加你想要执行的操作
                // window.location.href = 'shufaDict.html';
                change_openModal();
                requestZidianDict3(1, 50, img.title, requestData)
            });

            var longPressTimer;

            // 长按事件处理函数
            function handleLongPress() {

            }

            // 处理鼠标按下事件
            img.addEventListener('mousedown', function () {
                longPressTimer = setTimeout(handleLongPress, 500); // 500毫秒后触发长按事件
            });

            // 处理鼠标擡起事件
            img.addEventListener('mouseup', function () {
                clearTimeout(longPressTimer); // 清除定时器
            });

            // 处理鼠标离开事件
            img.addEventListener('mouseleave', function () {
                clearTimeout(longPressTimer); // 清除定时器
            });

            // 处理触摸事件（移动设备）
            img.addEventListener('touchstart', function () {
                longPressTimer = setTimeout(handleLongPress, 500); // 500毫秒后触发长按事件
            });

            img.addEventListener('touchend', function () {
                clearTimeout(longPressTimer); // 清除定时器
            });

            img.addEventListener('touchcancel', function () {
                clearTimeout(longPressTimer); // 清除定时器
            });
        }
    }
}
function requestData(results) {

    var container = document.getElementById("container2");
    container.innerHTML = '';
    results.forEach(function (object) {
        var newDiv = document.createElement("div");
        newDiv.classList.add("card");
        container.appendChild(newDiv);
        var newImg = document.createElement("img");
        setImgData(newImg, object);
        newDiv.appendChild(newImg);
        newImg.addEventListener('click', function () {
            setImgData(currentImg, object);
            dataArray[currentImgIndex] = object;
        });
    })
}

function beginSave() {
   
}
function showCustomAlert(message) {
    var modal = document.getElementById('customModal');
    var modalMessage = document.getElementById('modalMessage');
    var closeButton = document.getElementsByClassName('close-button')[0];

    modalMessage.textContent = message;
    modal.style.display = "block";

    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function savaPic() {

    html2canvas(document.getElementById('container'), {
        useCORS: true,
        allowTaint: false
    }).then(function (canvas) {
        if (!canvas) {
            console.error('Canvas is null or undefined');
            return;
        }
        const contain = document.getElementById('container');
        contain.style.visibility = 'hidden'; // 使用 visibility 而不是 display

        var overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        var imgContainer = document.createElement('div');
        imgContainer.style.display = 'flex';
        imgContainer.style.flexDirection = 'column';
        imgContainer.style.alignItems = 'center';
        imgContainer.style.maxWidth = '90%';
        imgContainer.style.maxHeight = '90%';

        var img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.maxWidth = '100%';
        img.style.maxHeight = '80vh';
        img.style.objectFit = 'contain';

        var closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.marginTop = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.fontSize = '15px';
        closeButton.style.color = '#ffffff';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function () {
            document.body.removeChild(overlay);
            contain.style.visibility = 'visible'; // 恢复可见性
        };

        imgContainer.appendChild(img);
        imgContainer.appendChild(closeButton);
        overlay.appendChild(imgContainer);
        document.body.appendChild(overlay);

        // 使用 setTimeout 来延迟显示提示，确保图片已经渲染
        setTimeout(function() {
            showCustomAlert('请长按图片并选择"保存图像"来下载截图');
        }, 100);


    });

}
function frame_openModal() {

    html2canvas(document.getElementById('container'), {
        useCORS: true,
        allowTaint: false
    }).then(function (canvas) {
        // 将截图保存为图片
        // 将画布转换为 Data URL
        const imgData = canvas.toDataURL('image/png');
        // 将图片数据存储到 Local Storage
        localStorage.setItem('jizi2_screenshot', imgData);
        // 跳转到下一个页面
        window.location.href = 'jizi2_frame.html'; // 替换为你的目标页面
    });
}

function setImgData(img, ob) {
    const imgurl = ob.get('img');
    if (imgurl == undefined) {
        let str = 'https://image.lintiebao.cn/shufa/dic/' + ob.get('title') + '.jpg'
        var decodedUrl = decodeURIComponent('https://proxyimage.lintiebao.cn/proxy?url=' + str);
        img.src = decodedUrl;
    } else {
        const encrypt = new JSEncrypt();
        encrypt.setPrivateKey(key);
        const decryptedData = encrypt.decrypt(imgurl);
        var decodedUrl = decodeURIComponent('https://proxyimage.lintiebao.cn/proxy?url=' + decryptedData);
        img.src = decodedUrl;
    }
}
function showCustomAlert(message) {
    // 如果模态框还不存在，则创建它
    if (!document.getElementById('customModal')) {
        createCustomModal();
    }
    var modal = document.getElementById('customModal');
    var modalMessage = document.getElementById('modalMessage');
    var closeButton = document.getElementsByClassName('close-button')[0];

    modalMessage.textContent = message;
    modal.style.display = "block";

    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
function createCustomModal() {
    
    // 创建主容器
    var modal = document.createElement('div');
    modal.id = 'customModal';
    modal.className = 'custom-modal';

    // 创建内容容器
    var modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // 创建消息段落
    var modalMessage = document.createElement('p');
    modalMessage.id = 'modalMessage';

    // 创建关闭按钮
    var closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = '确定';

    // 组装模态框
    modalContent.appendChild(modalMessage);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);

    // 添加到 body
    document.body.appendChild(modal);

    // 添加样式
    var style = document.createElement('style');
    style.textContent = `
        .custom-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--bg-content-color) !important;
            margin: 15% auto;
            padding: 20px;
            border: 0px solid #888;
            width: 80%;
            max-width: 300px;
            border-radius: 5px;
            font-size: 15px !important;
            color: #666 !important;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #modalMessage {
            margin-bottom: 20px;
        }
        .close-button {
            padding: 10px 20px;
            background-color: var(--main-color);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
        }
        .close-button:hover {
            background-color: var(--main-color);
        }
    `;
    document.head.appendChild(style);
}