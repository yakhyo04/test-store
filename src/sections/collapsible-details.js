import './styles/collapsible-details.scss';
import { onDocumentReady } from '../utils/dom';
import handleActiveItem from '../utils/handleActiveItem';

const state = {
    elements: {}
}

const cacheState = () => {
    state.elements = {
        headerItems: document.querySelectorAll(".collapsible-details__header"),
        details: document.querySelectorAll(".collapsible-details__content"),
    }
}

const attachAddEventListeners = () => {
    state.elements.headerItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            handleActiveItem(state.elements.details, index, 'active')
            handleActiveItem(state.elements.headerItems, index, 'active')
        })
    })
}

const init = () => {
    cacheState();
    attachAddEventListeners();
}

onDocumentReady(init);

class CollapsableDetails extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        onDocumentReady(() => {
            this.headerElement = this.querySelector("[data-component='header']");
            this.bodyElement = this.querySelector("[data-body='header']");
            console.log("initialized");
            this.init();

            const shouldInitiallyOpen = this.getAttribute("data-initially-open");
            if(shouldInitiallyOpen === 'true'){
                this.classList.add("active")
            }
        })
    }

    init(){
        this.headerElement.addEventListener("click", () => {
            console.log("Clicked");
            this.toggle();
        })
    }

    toggle(){
        const currentlyOpened = document.querySelector("collapsible-details.active");

        if(currentlyOpened && currentlyOpened !== this){
            currentlyOpened.classList.remove("active")
        }
        this.classList.toggle("active");
    }

    disconnectedCallback(){
        console.log("Disconnected Callback")
    }

    adoptedCallback(){
        console.log("Adopted Callback")
    }
}

customElements.define('collapsible-details', CollapsableDetails)
