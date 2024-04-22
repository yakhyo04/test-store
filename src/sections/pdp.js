import './styles/pdp.scss';
import Swiper from 'swiper';
import 'swiper/css/bundle';
import { onDocumentReady } from '../utils/dom';
import { formatMoney } from '../utils/formatMoney';

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
        const swiper = new Swiper(state.elements.productSwiper, {
            loop: true,
            spaceBetween: 10,
            slidesPerView: 4,
            direction: 'horizontal',
            freeMode: true,
            watchSlidesProgress: true,
            breakpoints: {
                1000: {
                    direction: 'vertical',
                }
            }
        })
        const swiperThumbs = new Swiper(state.elements.thumbSwiper, {
            loop: true,
            spaceBetween: 10,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            thumbs: {
                swiper,
            },
        })
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

const optionsChecked = (selectedOptions) => {
    state.elements.productOptionsChecked.forEach(radio => {
        selectedOptions.push(radio.value);
    })
}

const matchedVariant = (selectedOptions) => {
    const product = JSON.parse(state.elements.productObj);
    product.variants.find(variant => {
        let pass = true;
    
        for(let i = 0; i < selectedOptions.length; i++){
            if(selectedOptions.indexOf(variant.options[i]) === -1){
                pass = false;
                break;
            }
        }

        return pass;
    })
}

const productOptionsFunction = () => {
    let selectedOptions = [];
    const product = JSON.parse(state.elements.productObj);

    state.elements.productOptionsChecked.forEach(radio => {
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

    state.elements.productId = matchedVariant.id;

    state.queryParams.params.set('variant', matchedVariant.id);
    const urlResult = state.queryParams.url.toString() + "?" + state.queryParams.params.toString();
    window.history.replaceState(null, null, urlResult);

    state.elements.price.textContent = formatMoney(matchedVariant.price, state.elements.price.getAttribute('data-price'));
    state.elements.comparePrice.textContent = formatMoney(matchedVariant.compare_at_price, state.elements.comparePrice.getAttribute('data-comparePrice'));

    // matchedVariant.compare_at_price > matchedVariant.price ? state.elements.comparePrice.classlist.remove('hide') : state.elements.comparePrice.classlist.add('hide');

    if(matchedVariant.featured_media){
        state.elements.imageId.setAttribute('src', matchedVariant.featured_image.src)
        state.elements.imageSelected.classList.remove("selected");
        state.elements.images[matchedVariant.featured_image.position - 1].classList.add('swiper-slide-thumb-active');          
    }

    if(matchedVariant.available){
        state.elements.addToCart.textContent = 'Add to Cart'
        state.elements.addToCart.disabled = false
        state.elements.buyItNow.textContent = 'Buy It Now'
        state.elements.buyItNow.disabled = false
    }else{
        state.elements.addToCart.textContent = 'Out of Stock'
        state.elements.addToCart.disabled = true
        state.elements.buyItNow.textContent = 'Out of Stock'
        state.elements.buyItNow.disabled = true
    }
}

const imageSwiperFunction = () => {
    state.elements.images.forEach(li => {
        li.addEventListener("click", () => {
            state.elements.imageSelected.classList.remove("selected");
            li.classList.add('selected')

            state.elements.productId.setAttribute('src', li.querySelector('img').getAttribute('src'))
        })
    })
}

const attachAddEventListeners = () => {
    state.elements.quantityPlus.addEventListener("click", quantityPlus);
    state.elements.quantityMinus.addEventListener("click", quantityMinus);
    state.elements.buyItNow.addEventListener("click", (e) => buyNow(e));
    state.elements.productOptions.forEach((radio) => {
        radio.addEventListener("change", productOptionsFunction)
    })
}

const init = () => {
    cacheState();
    attachAddEventListeners();
    if(window.loadedScripts["pdp-swiper"]) return;
    window.loadedScripts["pdp-swiper"] = true;
    initializeSwipers();
    imageSwiperFunction();
}

onDocumentReady(init);