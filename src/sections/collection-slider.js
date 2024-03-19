import './styles/collection-slider.scss'

let featuredButton = document.querySelectorAll(".featured__button");
let addToCartForm = document.querySelectorAll('form[action$="/cart/add"]');

featuredButton.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        let productId;
        addToCartForm.forEach((formItem) => {
            productId = formItem.childNodes[1].defaultValue
        })

        let formData = {
            'items': [{
                'id': productId,
                'quantity': 1
            }]
        }

        console.log(featuredButton[0].id);

        fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
    })
})