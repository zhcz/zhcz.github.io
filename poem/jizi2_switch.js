
function setupSwitch() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", function () {
            updateBugs(this);
        });
        checkboxes[0].checked = true;
    }
}
function updateBugs(changedElement) {
    var checkedCount = document.querySelectorAll('input:checked').length;
    const mizigeImgs = document.querySelectorAll('img.mizige');
    mizigeImgs.forEach(img => {
        if (checkedCount === 1) {
            isSwitchOn = true
            img.style.display = 'block';
        } else {
            isSwitchOn = false
            img.style.display = 'none';
        }
    });
}