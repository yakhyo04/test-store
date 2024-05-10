import './styles/pdp.scss';
import Swiper from 'swiper';
import { Thumbs } from 'swiper';
import 'swiper/css/bundle';
import { onDocumentReady } from '../utils/dom';
import { formatMoney } from '../utils/formatMoney';
import handleActiveItem from '../utils/handleActiveItem';

const state = {
    elements: {},
    queryParams: {},
}

const cacheState = () => {
    state.elements = {
        productSwiper: document.querySelector(".product-swiper"),
        thumbSwiper: document.querySelector(".thumbnail-swiper"),
        productObj: document.querySelector("[data-product]")?.getAttribute("data-product"),
        productOptions: document.querySelectorAll('.product__option input[type="radio"]'),
        productOptionsChecked: document.querySelectorAll('.product__option input[type="radio"]:checked'),
        productId: document.querySelector('#product__id'),
        price: document.querySelector('.pdp__price'),
        comparePrice: document.querySelector('.pdp__compare--price'),
        imageId: document.querySelector('#product-image'),
        imageSelected: document.querySelector('.product-swiper .pdp__image.selected'),
        images: document.querySelectorAll('.product-swiper .pdp__image'),
        addToCart: document.querySelector('#add-to-cart'),
        buyItNow: document.querySelector('#buy-it-now'),
        form: document.querySelector('.shopify-product-form'),
        quantityPlus: document.querySelector('.quantity__selector--plus'),
        quantityMinus: document.querySelector('.quantity__selector--minus'),
        quantity: document.querySelector('#quantity'),
    }
    state.queryParams = {
        url: window.location.pathname,
        params: new URLSearchParams(window.location.search),
    }
}

const initializeSwipers = () => {
    const swiperProduct = new Swiper(state.elements.productSwiper, {
        loop: true,
        spaceBetween: 10,
        slidesPerView: 3,
        direction: 'horizontal',
        slideActiveClass: 'swiper-slide-thumb-active',
        freeMode: true,
        slideToClickedSlide: true,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        breakpoints: {
            1000: {
                direction: 'vertical',
                slidesPerView: 4,
            }
        }
    })
    
    // swiperProduct.on("click", () => {
    //     const clickedSlideIndex = swiperProduct.clickedIndex;
    //     console.log({clickedSlideIndex});
    //     swiperProduct.slideTo(clickedSlideIndex);
    // })

    const swiperThumbs = new Swiper(state.elements.thumbSwiper, {
        loop: true,
        spaceBetween: 10,
        modules: [Thumbs],
        slideActiveClass: 'swiper-slide-thumb-active',
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        thumbs: {
            swiper: swiperProduct,
        }
    })

    const swiper = new Swiper('.pdp__slider--wrapper2', {
        enabled: false,
        scrollbar: {
            el: ".swiper-scrollbar",
            hide: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            300: {
                enabled: true,
                on: {
                    breakpoint: function(){
                        swiper.init();
                    }
                }
            },
            1009: {
                enabled: false,
                on: {
                    breakpoint: function(){
                        swiper.destroy();
                    }
                }
            }
        },
    });

    swiper.on('breakpoint', function (swiper, breakpointParams) {
        console.log("hellooooo worlddddd", breakpointParams)
        if (!breakpointParams.enabled) {
            swiper.destroy();
        }
    })

    // let isActive = false;

    // swiperProduct.on("slideChange", () => {
    //     const currentSlide = swiperProduct.slides[swiperProduct.activeIndex];
    //     const currentSlideIndex = currentSlide.getAttribute('data-swiper-slide-index');
    //     swiperThumbs.slideTo(currentSlideIndex);
    //     isActive = true;
    // });

    // swiperThumbs.on("slideChange", () => {
    //     if(isActive) {
    //         return isActive = !isActive;
    //     }
    //     const currentSlide = swiperThumbs.slides[swiperThumbs.activeIndex];
    //     const currentSlideIndex = currentSlide.getAttribute('data-swiper-slide-index');
    //     swiperProduct.slideTo(currentSlideIndex);
    // })
}

const quantityPlus = () => {
    let quantityValue = state.elements.quantity;
    const currentValue = Number(quantityValue.value);
    quantityValue.value = currentValue + 1;
}

const quantityMinus = () => {
    let quantityValue = state.elements.quantity;
    const currentValue = Number(quantityValue.value);
    
    if(currentValue > 1){
        quantityValue.value = currentValue - 1;
    }
}

const buyNow = (e) => {
    e.preventDefault();

    const input = document.createElement('input');
    input.value = '/checkout'
    input.type = 'hidden'
    input.name = 'return_to'

    state.elements.form.appendChild(input);
    state.elements.form.submit();
}

const buttonsTextChange = (isAvailable) => {
    const addToCartButton = state.elements.addToCart;
    const buyItNowButton = state.elements.buyItNow;
    const buttonText = isAvailable ? ['Add to Cart', 'Buy It Now'] : ['Out of Stock', 'Out of Stock'];
    const buttonDisabled = !isAvailable;
    addToCartButton.textContent = buttonText[0];
    addToCartButton.disabled = buttonDisabled;
    buyItNowButton.textContent = buttonText[1];
    buyItNowButton.disabled = buttonDisabled;
}


const onChangeFunction = () => {
    let product = JSON.parse(state.elements.productObj);
    let selectedOptions = [];

    document.querySelectorAll('.product__option input[type="radio"]:checked').forEach(radio => {
        selectedOptions.push(radio.value);
    })

    let matchedVariant = product.variants.find(variant => {
        let pass = true;
        for(let i = 0; i < selectedOptions.length; i++){
            if(selectedOptions.indexOf(variant.options[i]) === -1){
                pass = false;
                break;
            }
        }

        return pass;
    })

    state.elements.productId.value = matchedVariant.id;

    buttonsTextChange(matchedVariant.available);

    const price = state.elements.price;
    const comparePrice = state.elements.comparePrice;

    price.textContent = formatMoney(matchedVariant.price, price.getAttribute('data-price'));
    comparePrice.textContent = formatMoney(matchedVariant.compare_at_price, comparePrice.getAttribute('data-comparePrice'));

    matchedVariant.compare_at_price > matchedVariant.price ? comparePrice.classList.remove("hide") : comparePrice.classList.add("hide");
    
    const url = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    params.set('variant', matchedVariant.id);
    const urlResult = url.toString() + "?" + params.toString();
    window.history.replaceState(null, null, urlResult);
}

const attachAddEventListeners = () => {
    state.elements.quantityPlus.addEventListener("click", quantityPlus);
    state.elements.quantityMinus.addEventListener("click", quantityMinus);
    state.elements.buyItNow.addEventListener("click", (e) => buyNow(e));
    document.querySelectorAll('.product__option input[type="radio"]').forEach(radio => {
        radio.addEventListener("change", () => onChangeFunction())
    })
}

const init = () => {
    cacheState();
    attachAddEventListeners();
    if(window.loadedScripts["pdp-swiper"]) return;
    window.loadedScripts["pdp-swiper"] = true;
    initializeSwipers();
}

onDocumentReady(init);