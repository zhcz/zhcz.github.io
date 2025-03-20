let prevLink = document.querySelector(".prev");
let nextLink = document.querySelector(".next");
let pagination = document.querySelector(".pagination");
let pageNumberLinks = document.querySelectorAll(".page-number a");
let maxPageIndex = pageNumberLinks.length - 1;

pageNumberLinks.forEach((pageNumberLink, activeIndex) => {
    pageNumberLink.addEventListener("click", () => {
        pageNumberLinks.forEach(pageNumberLink =>
            pageNumberLink.parentElement.classList.remove("active")
        );
        pageNumberLink.parentElement.classList.add("active");
        pagination.style.setProperty("--active-index", `${activeIndex}`);

        document.getElementById("imageContainer").innerHTML = "";
        initData(pageNumberLink.innerText);

    });
});

prevLink.addEventListener("click", () => {
    pageNumberLinks.forEach(pageNumberLink =>
        pageNumberLink.parentElement.classList.remove("active")
    );
    let activeIndex = Number(pagination.style.getPropertyValue("--active-index"));
    activeIndex = activeIndex > 0 ? activeIndex - 1 : 0;
    pageNumberLinks[activeIndex].parentElement.classList.add("active");
    pagination.style.setProperty("--active-index", `${activeIndex}`);

    let a = pageNumberLinks[activeIndex];
    document.getElementById("imageContainer").innerHTML = "";
    initData(a.innerText);
});

nextLink.addEventListener("click", () => {
    pageNumberLinks.forEach(pageNumberLink =>
        pageNumberLink.parentElement.classList.remove("active")
    );
    let activeIndex = Number(pagination.style.getPropertyValue("--active-index"));
    activeIndex = activeIndex < maxPageIndex ? activeIndex + 1 : maxPageIndex;
    pageNumberLinks[activeIndex].parentElement.classList.add("active");
    pagination.style.setProperty("--active-index", `${activeIndex}`);
    let a = pageNumberLinks[activeIndex];
    document.getElementById("imageContainer").innerHTML = "";
    initData(a.innerText);
});