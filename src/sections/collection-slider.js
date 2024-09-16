import './styles/collection-slider.scss';
import { onDocumentReady } from '../utils/dom';
import { addToCart } from '../utils/addToCart';

const state = {
    elements: {}
}

const cacheState = () => {
    state.elements = {
        mySwiper: document.querySelectorAll(".collection__slider--swiper"),
    }
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