import './styles/cart-drawer.scss';
import { onDocumentReady } from '../utils/dom';

const state = {
    elements: {}
}

const cacheState = () => {
    state.elements = {
        closeIcon: document.querySelector(".cart__drawer-header-right-close"),
        cartDrawer: document.querySelector(".cart__drawer"),
        headerCart: document.querySelector(".header__right--cart"),
        bodyWrapper: document.querySelector("body"),
        cartIcon: document.querySelectorAll('a[href="/cart"]'),
        quantitySelectorButton: document.querySelectorAll(".cart__drawer-quantity-selector button"),
    }
}

const openCartDrawer = () => {
    state.elements.cartDrawer.classList.add("cart__drawer--active");
    state.elements.bodyWrapper.style.overflow = 'hidden'
}

const closeCartDrawer = () => {
    state.elements.cartDrawer.classList.remove("cart__drawer--active");
    state.elements.bodyWrapper.style.overflow = 'unset'
}

const cartDrawerBox = () => {
    document.querySelector(".cart__drawer-box").addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

const updateCartItemCounts = (count) => {
    document.querySelectorAll(".header__cart--count").forEach(el => {
        el.textContent = count;
    })
}

const updateCartDrawer = async () => {
    const res = await fetch(`/?${window.cartDrawerId}`);
    const data = await res.text();
    const productCard = document.createElement("div");
    productCard.innerHTML = data;

    const productWrapper = productCard.querySelector(".cart__drawer").innerHTML;

    document.querySelector(".cart__drawer").innerHTML = productWrapper;

    cartDrawerBox();
    addCartDrawerListeners();
}

const addCartDrawerListeners = () => {
    document.querySelectorAll(".cart__drawer-quantity-selector button").forEach((button) => {
        button.addEventListener("click", async () => {
            const rootItem = button.parentElement.parentElement.parentElement.parentElement.parentElement;

            const key = rootItem.getAttribute('data-line-item-key');

            const currentQuantity = Number(button.parentElement.querySelector("input").value);
            const isUp = button.classList.contains("cart__drawer-quantity-selector-plus");
            const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;

            const res = await fetch("/cart/update.js", {
                method: 'post',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ updates: {[key]: newQuantity} })
            });
            
            const cart = await res.json();

            updateCartItemCounts(cart.item_count);

            updateCartDrawer();
        })
    })
}

const attachEventListeners = () => {
    state.elements.closeIcon.addEventListener("click", closeCartDrawer);
    state.elements.headerCart.addEventListener("click", openCartDrawer);
    document.querySelectorAll(".cart__drawer, .cart__drawer-header-right-close").forEach((el) => {
        el.addEventListener("click", closeCartDrawer);
    });
    state.elements.cartIcon.forEach((a) => {
        a.addEventListener("click", (e) => {
            e.preventDefault();
            openCartDrawer();
        })
    });
}

const init = () => {
    cacheState();
    cartDrawerBox();
    addCartDrawerListeners();
    attachEventListeners();
}

onDocumentReady(init);

export const cartDrawerFunctions = () => {
    openCartDrawer();
    updateCartDrawer();
    cartDrawerBox();
    addCartDrawerListeners();
}