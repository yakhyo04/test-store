import './styles/header.scss';

document.addEventListener("DOMContentLoaded", () => {
    const iconHamburger = document.querySelector(".header__icon--hamburger");
    const mobileDrawer = document.querySelector(".header__mobile--drawer");
    const iconClose = document.querySelector(".header__icon--close");
    const bodyWrapper = document.querySelector("body");
    const headerOverlay = document.querySelector(".header__mobile--overlay");
    const headerSearch = document.querySelector(".header__search");
    const headerSearchWrapper = document.querySelector(".header__search--wrapper");
    const headerClose = document.querySelector(".header__search--close");

    const openMobileDrawer = () => {
        mobileDrawer.classList.add("open");
        headerOverlay.classList.add("active");
        bodyWrapper.style.overflow = 'hidden';
    };

    const closeMobileDrawer = () => {
        mobileDrawer.classList.remove("open");
        headerOverlay.classList.remove("active");
        bodyWrapper.style.overflow = 'visible';
        headerSearchWrapper.classList.remove("active");
    };

    const openHeaderSearch = () => {
        headerSearchWrapper.classList.add("active");
        headerOverlay.classList.add("active");
        bodyWrapper.style.overflow = 'hidden';
    }

    iconHamburger.addEventListener("click", openMobileDrawer);
    iconClose.addEventListener("click", closeMobileDrawer);
    headerOverlay.addEventListener("click", closeMobileDrawer);
    headerSearch.addEventListener("click", openHeaderSearch);
    headerClose.addEventListener("click", closeMobileDrawer);
});