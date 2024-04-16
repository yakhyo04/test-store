import './styles/collection-slider.scss';
import { onDocumentReady } from '../utils/dom';

const state = {
    elements: {}
}

const cacheState = () => {
    state.elements = {
        mySwiper: document.querySelectorAll(".collection__slider--swiper"),
    }
}

const addToCart = (e) => {
    const { target } = e;

    if(!target.closest("[data-item='button']")) return false;

    e.preventDefault();

    const productId = target.closest("[data-id]").dataset.id;

    const formData = {
        items: [
            {
                id: productId,
                quantity: 1,
            }
        ]
    }

    fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(formData),
    })
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => {
        console.log("Error message: ", error)
    })
}

const initializeSwipers = () => {
    state.elements.mySwiper.forEach((swiperContainer, index) => {
        const swiper = new Swiper(swiperContainer, {
            slidesPerView: 4,
            spaceBetween: 18,
            direction: 'horizontal',
            breakpoints: {
                220: {
                slidesPerView: 1,
                spaceBetween: 10,
                },
                370: {
                slidesPerView: 2,
                spaceBetween: 10,
                },
                550: {
                slidesPerView: 3,
                spaceBetween: 20,
                },
                1000: {
                slidesPerView: 4,
                spaceBetween: 30,
                }
                
            },
            pagination: {
                el: swiperContainer.querySelector('.swiper-pagination'),
                clickable: true,
            },
        });
    });
};

const init = () => {
    cacheState();
    if (window.loadedScripts["featured-products"]) return;
    window.loadedScripts["featured-products"] = true;
    initializeSwipers();
}

onDocumentReady(init);

class AddToCart extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        onDocumentReady(() => {
            this.addToCart = this.querySelector("[data-component='add-to-cart']");
            console.log("initial");
            this.init();
        })
    }

    init(){
        document.addEventListener("click", (e) => {
            addToCart(e);
        })
    }

    disconnectedCallback(){
        console.log("Disconnected Callback")
    }

    adoptedCallback(){
        console.log("Adopted Callback")
    }
}

customElements.define("add-to-cart", AddToCart);