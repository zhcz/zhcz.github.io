

// 打开弹窗函数
function color_openModal() {
    const color_modal = document.getElementById('color_modal');
    color_modal.style.display = 'block';
    overlay.style.display = 'block';
    color_modal.classList.add('fadeIn'); // 添加动画类名
}
// 关闭弹窗函数
function color_closeModal() {
    const color_modal = document.getElementById('color_modal');
    color_modal.style.display = 'none';
    overlay.style.display = 'none';
    color_modal.classList.remove('fadeIn'); // 移除动画类名
}
function color_setupUI() {
    const overlay = document.getElementById('overlay');
    const color_closeModalBtn = document.getElementById('color_closeModalBtn');
    document.getElementById('button2').addEventListener('click', color_openModal);
    color_closeModalBtn.addEventListener('click', color_closeModal);
    overlay.addEventListener('click', color_closeModal);
}
