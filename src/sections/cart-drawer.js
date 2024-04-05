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

export const updateCartDrawer = async () => {
    const res = await fetch(`/?${localStorage.getItem("cartDrawerId")}`);
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

// const init = () => {

// const headerCart = document.querySelector(".header__right--cart");

// function openCartDrawer() {
//     document.querySelector(".cart__drawer").classList.add("cart__drawer--active");
//   }

//   headerCart.addEventListener("click", openCartDrawer);
  
//   function closeCartDrawer() {
//     document
//       .querySelector(".cart__drawer")
//       .classList.remove("cart__drawer--active");
//   }
  
//   function updateCartItemCounts(count) {
//     document.querySelectorAll(".cart-count").forEach((el) => {
//       el.textContent = count;
//     });
//   }
  
//   async function updateCartDrawer() {
//     const res = await fetch("/?section_id=cart__drawer");
//     const text = await res.text();
//     const html = document.createElement("div");
//     html.innerHTML = text;
  
//     const newBox = html.querySelector(".cart__drawer").innerHTML;
  
//     document.querySelector(".cart__drawer").innerHTML = newBox;
  
//     addCartDrawerListeners();
//   }
  
//   function addCartDrawerListeners() {
//     // Update quantities
//     document
//       .querySelectorAll(".cart__drawer-quantity-selector button")
//       .forEach((button) => {
//         button.addEventListener("click", async () => {
//           // Get line item key
//           const rootItem =
//             button.parentElement.parentElement.parentElement.parentElement
//               .parentElement;
//           const key = rootItem.getAttribute("data-line-item-key");
  
//           // Get new quantity
//           const currentQuantity = Number(
//             button.parentElement.querySelector("input").value
//           );
//           const isUp = button.classList.contains(
//             "cart__drawer-quantity-selector-plus"
//           );
//           const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;
  
//           // Ajax update\
//           const res = await fetch("/cart/update.js", {
//             method: "post",
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ updates: { [key]: newQuantity } }),
//           });
//           const cart = await res.json();
  
//           updateCartItemCounts(cart.item_count);
  
//           // Update cart
//           updateCartDrawer();
//         });
//       });
  
//     document.querySelector(".cart__drawer-box").addEventListener("click", (e) => {
//       e.stopPropagation();
//     });
  
//     document
//       .querySelectorAll(".cart__drawer-header-right-close, .cart__drawer")
//       .forEach((el) => {
//         el.addEventListener("click", () => {
//           console.log("closing drawer");
//           closeCartDrawer();
//         });
//       });
//   }
  
//   addCartDrawerListeners();
  
//   document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
//     form.addEventListener("submit", async (e) => {
//       e.preventDefault();
  
//       // Submit form with ajax
//       await fetch("/cart/add", {
//         method: "post",
//         body: new FormData(form),
//       });
  
//       // Get cart count
//       const res = await fetch("/cart.js");
//       const cart = await res.json();
//       updateCartItemCounts(cart.item_count);

//       // Update cart
//       await updateCartDrawer();
  
//       // Open cart drawer
//       if(cart.item_count){
//         openCartDrawer();
//       }else{
//         closeCartDrawer();
//       }
//     });
//   });
  
//   document.querySelectorAll('a[href="/cart"]').forEach((a) => {
//     a.addEventListener("click", (e) => {
//       e.preventDefault();
//       openCartDrawer();
//     });
//   });

// }

// onDocumentReady(init);