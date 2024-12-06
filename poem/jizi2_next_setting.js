
// 打开弹窗函数
function setting_openModal() {
    const setting_modal = document.getElementById('setting_modal');
    setting_modal.style.display = 'block';
    overlay.style.display = 'block';
    setting_modal.classList.add('fadeIn'); // 添加动画类名
}
// 关闭弹窗函数
function setting_closeModal() {
    const setting_modal = document.getElementById('setting_modal');
    setting_modal.style.display = 'none';
    overlay.style.display = 'none';
    setting_modal.classList.remove('fadeIn'); // 移除动画类名
}
function setting_setupUI() {
    const overlay = document.getElementById('overlay');
    const setting_closeModalBtn = document.getElementById('setting_closeModalBtn');
    document.getElementById('button3').addEventListener('click', setting_openModal);
    setting_closeModalBtn.addEventListener('click', setting_closeModal);
    overlay.addEventListener('click', setting_closeModal);
     // 阻止默认的滚动行为
    
}