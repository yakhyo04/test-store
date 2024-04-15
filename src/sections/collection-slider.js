import './styles/collection-slider.scss';
import { onDocumentReady } from '../utils/dom';

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