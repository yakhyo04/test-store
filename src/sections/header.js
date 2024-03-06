import './styles/header.scss';

const state = {
    elements: {},
}

const cacheState = () => {
    state.elements = {
        iconHamburger: document.querySelector(".header__icon--hamburger"),
        mobileDrawer: document.querySelector(".header__mobile--drawer"),
        iconClose: document.querySelector(".header__icon--close"),
        bodyWrapper: document.querySelector("body"),
        headerOverlay: document.querySelector(".header__mobile--overlay"),
        headerSearch: document.querySelector(".header__search"),
        headerSearchWrapper: document.querySelector(".header__search--wrapper"),
        headerClose: document.querySelector(".header__search--close"),
    }
}

const openMobileDrawer = () => {
    state.elements.mobileDrawer.classList.add("open");
    state.elements.headerOverlay.classList.add("active");
    state.elements.bodyWrapper.style.overflow = 'hidden';
}

const closeMobileDrawer = () => {
    state.elements.mobileDrawer.classList.remove("open");
    state.elements.headerOverlay.classList.remove("active");
    state.elements.bodyWrapper.style.overflow = 'visible';
    state.elements.headerSearchWrapper.classList.remove("active");
}

const openHeaderSearch = () => {
    state.elements.headerSearchWrapper.classList.add("active");
    state.elements.headerOverlay.classList.add("active");
    state.elements.bodyWrapper.style.overflow = 'hidden';
}

const attachEventListeners = () => {
    state.elements.iconHamburger.addEventListener("click", openMobileDrawer);

    state.elements.iconClose.addEventListener("click", closeMobileDrawer);

    state.elements.headerOverlay.addEventListener("click", closeMobileDrawer);

    state.elements.headerSearch.addEventListener("click", openHeaderSearch);

    state.elements.headerClose.addEventListener("click", closeMobileDrawer);
}

const init = () => {
    cacheState();
    attachEventListeners();
}

document.addEventListener("DOMContentLoaded", init);