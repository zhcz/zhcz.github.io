var isSwitchOn = true;

// 打开弹窗函数
function mi_openModal() {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    modal.classList.add('fadeIn'); // 添加动画类名
}

// 关闭弹窗函数
function mi_closeModal() {
    modal.style.display = 'none';
    overlay.style.display = 'none';
    modal.classList.remove('fadeIn'); // 移除动画类名
}

function mi_setupUI() {
    const overlay = document.getElementById('overlay');
    // 获取弹窗相关元素
    const modal = document.getElementById('modal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // 为每个按钮添加点击事件，点击时打开弹窗
    document.getElementById('button1').addEventListener('click', mi_openModal);
    // document.getElementById('button2').addEventListener('click', openModal);
    // document.getElementById('button3').addEventListener('click', upscale);
    // 关闭弹窗事件
    closeModalBtn.addEventListener('click', mi_closeModal);
    overlay.addEventListener('click', mi_closeModal);

    document.getElementById('modalButton1').addEventListener('click', function () {
        if (isSwitchOn) {
            const mizigeImgs = document.querySelectorAll('img.mizige');
            mizigeImgs.forEach(img => {
                img.src = 'images/m1.png';
                img.style.display = 'block';
            });
        }
    });
    document.getElementById('modalButton2').addEventListener('click', function () {
        if (isSwitchOn) {
            const mizigeImgs = document.querySelectorAll('img.mizige');
            mizigeImgs.forEach(img => {
                img.src = 'images/m2.png';
                img.style.display = 'block';
            });
        }
    });
    document.getElementById('modalButton3').addEventListener('click', function () {
        if (isSwitchOn) {
            const mizigeImgs = document.querySelectorAll('img.mizige');
            mizigeImgs.forEach(img => {
                img.src = 'images/m3.png';
                img.style.display = 'block';
            });
        }
    });
    document.getElementById('modalButton4').addEventListener('click', function () {
        if (isSwitchOn) {
            const mizigeImgs = document.querySelectorAll('img.mizige');
            mizigeImgs.forEach(img => {
                img.src = 'images/m4.png';
                img.style.display = 'block';
            });
        }
    });

}