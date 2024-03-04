import './styles/header.scss';

document.addEventListener("DOMContentLoaded", () => {
    const iconHamburger = document.querySelector(".header__icon--hamburger");
    const mobileDrawer = document.querySelector(".header__mobile--drawer");
    const iconClose = document.querySelector(".header__icon--close");
    const bodyWrapper = document.querySelector("body");
    const headerOverlay = document.querySelector(".header__mobile--overlay");

    const openMobileDrawer = () => {
        mobileDrawer.classList.add("open");
        headerOverlay.classList.add("active");
        bodyWrapper.style.overflow = 'hidden';
    };

    const closeMobileDrawer = () => {
        mobileDrawer.classList.remove("open");
        headerOverlay.classList.remove("active");
        bodyWrapper.style.overflow = 'visible';
    };

    iconHamburger.addEventListener("click", openMobileDrawer);
    iconClose.addEventListener("click", closeMobileDrawer);
    headerOverlay.addEventListener("click", closeMobileDrawer);
});