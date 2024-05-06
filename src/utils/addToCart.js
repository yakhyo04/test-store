import { cartDrawerFunctions } from "../sections/cart-drawer";

export const addToCart = (callback) => {
  const { target } = callback;

  if (!target.closest("[data-item='button']")) return false;

  callback.preventDefault();

  const productId = target.closest("[data-id]").dataset.id;

  const formData = {
    items: [
      {
        id: productId,
        quantity: 1,
      },
    ],
  };

  fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      cartDrawerFunctions();
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.log("Error message: ", error);
    });
};
