import './styles/promotion.scss';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { onDocumentReady } from '../utils/dom';

const state = {
    elements: {}
}

const cacheState = () => {
    state.elements = {
        mySwiper: document.querySelectorAll('.mySwiper'),
    }
}

const initializeSwipers = () => {
    state.elements.mySwiper.forEach((swiperContainer, index) => {
        const swiper = new Swiper(swiperContainer, {
            slidesPerView: 1,
            spaceBetween: 18,
            direction: 'horizontal',
            pagination: {
                el: swiperContainer.querySelector('.swiper-pagination'),
                clickable: true,
            },
        });
    });
};

const init = () => {
    cacheState();
    if (window.loadedScripts["promotions"]) return;
    window.loadedScripts["promotions"] = true;
    initializeSwipers();
}

onDocumentReady(init);