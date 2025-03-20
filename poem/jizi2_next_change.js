
// 打开弹窗函数
function change_openModal() {
    const change_modal = document.getElementById('change_modal');
    const overlay = document.getElementById('overlay');

    change_modal.style.display = 'block';
    overlay.style.display = 'block';
}
// 关闭弹窗函数
function change_closeModal() {
    const change_modal = document.getElementById('change_modal');
    const overlay = document.getElementById('overlay');

    change_modal.style.display = 'none';
    overlay.style.display = 'none';
}
function change_setupUI() {
    const overlay = document.getElementById('overlay');
    const change_closeModalBtn = document.getElementById('change_closeModalBtn');
    // document.getElementById('button3').addEventListener('click', change_openModal);
    change_closeModalBtn.addEventListener('click', change_closeModal);
    overlay.addEventListener('click', change_closeModal);
    // 阻止默认的滚动行为


}