import "./styles/collection.scss";
import { onDocumentReady } from "../utils/dom";
import { addToCart } from "../utils/addToCart";

const state = {
  elements: {},
};

const cacheState = () => {
  state.elements = {
    sortBy: document.getElementById("SortBy"),
    collectionFilterCheckbox: document.querySelectorAll(
      ".collectionFilter input[type='checkbox']",
    ),
    collectionFilterPrice: document.querySelectorAll(
      ".filter-group-display__price-range input[type='number']",
    ),
    paginationItems: document.querySelectorAll("[data-pagination-item]"),
    paginationLinks: document.querySelectorAll("[data-pagination-link]"),
    paginateNext: document.querySelector("[data-next]"),
    collectionGrid: document.getElementById("CollectionGrid"),
    collectionButton: document.querySelector(".collection__load--button"),
    filterButton: document.querySelector(".collection__filter--button"),
    filterWrapper: document.querySelector(".collection__filters"),
    collectionOverlay: document.querySelector(".collection__overlay"),
    body: document.querySelector("body"),
    filterCloseButton: document.querySelector(
      ".collection__filters .icons__wrapper--span",
    ),
    paginateBtn: document.querySelectorAll(".collection__paginate--btn"),
    iconGrid: document.querySelector(".icon__grid"),
    iconList: document.querySelector(".icon__list"),
    collectionProduct: document.querySelectorAll(".collection__product"),
    url: new URL(window.location.href),
    sortResult: "created-ascending",
    defaultPage: 2,
    filterResult: "",
    filterPriceResult: "",
  };
};

const hidingPaginateBtn = () => {
  state.elements.paginateBtn.forEach((a) => {
    a.classList.add("active");
  });
};

const showingPaginateBtn = () => {
  state.elements.paginateBtn.forEach((a) => {
    a.classList.remove("active");
  });
};

const collectionLoadMore = async () => {
  try {
    const response = await fetch(
      `${window.location.pathname}?section=${window.sectionId}&sort_by=${state.elements.sortResult}&page=${state.elements.defaultPage}&${state.elements.filterResult}&${state.elements.filterPriceResult}`,
    );
    const data = await response.text();
    const collectionsWrapper = new DOMParser().parseFromString(
      data,
      "text/html",
    );
    const items = collectionsWrapper.querySelectorAll(".collection__product");
    state.elements.defaultPage += 1;

    const value = collectionsWrapper.querySelector(
      ".collection__grid--wrapper",
    );

    if (!value.dataset.next) {
      hidingPaginateBtn();
    } else {
      state.elements.paginateNext = value.dataset.next;
    }

    return items;
  } catch (error) {
    console.log(error);
  }
};

const renderCollections = (items) => {
  items.forEach((item) => {
    state.elements.collectionGrid.insertAdjacentElement("beforeend", item);
  });
};

const resultData = (data) => {
  const newInnerHtml = new DOMParser()
    .parseFromString(data, "text/html")
    .getElementById("CollectionGrid").innerHTML;

  state.elements.collectionGrid.innerHTML = newInnerHtml;
};

const setActivePagination = (itemIndex) => {
  state.elements.paginationItems.forEach((paginationItem, index) => {
    paginationItem.className = "";
    if (index !== itemIndex) {
      paginationItem.classList.add("pagination__content--number");
      return;
    }
    paginationItem.classList.add("pagination__content--link");
  });
};

const filterDrawerOpen = () => {
  state.elements.filterWrapper.classList.add("active");
  state.elements.collectionOverlay.classList.add("active");
  state.elements.body.overflow = "hidden";
};

const filterDrawerClose = () => {
  state.elements.filterWrapper.classList.remove("active");
  state.elements.collectionOverlay.classList.remove("active");
  state.elements.body.overflow = "visible";
};

const gridFunction = () => {
  state.elements.collectionGrid.classList.remove("collection__list--section");
  state.elements.collectionGrid.classList.add("collection__grid--section");
};

const listFunction = () => {
  state.elements.collectionGrid.classList.remove("collection__grid--section");
  state.elements.collectionGrid.classList.add("collection__list--section");
};

function updateUrlParams() {
  const { sortBy } = state.elements;
  const params = new URLSearchParams();

  if (sortBy.value) {
    state.elements.defaultPage = 2;
    showingPaginateBtn();
    state.elements.sortResult = sortBy.value;
    params.set(sortBy.name, sortBy.value);
  }

  state.elements.collectionFilterCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      const name = checkbox.getAttribute("name");
      const value = checkbox.getAttribute("value");
      state.elements.defaultPage = 2;
      showingPaginateBtn();
      state.elements.filterResult = `${`${name}=${value}`}`;
      params.append(name, value);
    }
  });

  state.elements.collectionFilterPrice.forEach((price) => {
    state.elements.defaultPage = 2;
    showingPaginateBtn();
    const name = price.getAttribute("name");
    state.elements.filterPriceResult = `${`${name}=${price.value}`}`;
    params.set(name, price.value);
  });

  const { paginationItems } = state.elements;
  for (let i = 0; i < paginationItems.length; i++) {
    const item = paginationItems[i];
    if (item.classList.contains("pagination__content--link")) {
      const value = item.getAttribute("data-value");
      // state.elements.defaultPage = value + 1;
      const name = item.getAttribute("name");
      params.set(name, value);
      break;
    }
  }

  state.elements.url.search = params.toString();
  window.history.pushState({}, "", state.elements.url);
}

const fetchData = async () => {
  state.elements.collectionGrid.classList.add("active");
  const res = await fetch(state.elements.url);
  const data = await res.text();

  if (data) {
    state.elements.collectionGrid.classList.remove("active");
    resultData(data);
  }
};

const sortFunction = async () => {
  updateUrlParams();
  fetchData();
};

const attachEventListeners = () => {
  state.elements.sortBy.addEventListener("change", sortFunction);
  state.elements.filterButton.addEventListener("click", filterDrawerOpen);
  state.elements.collectionOverlay.addEventListener("click", filterDrawerClose);
  state.elements.filterCloseButton.addEventListener("click", filterDrawerClose);
  state.elements.iconGrid.addEventListener("click", gridFunction);
  state.elements.iconList.addEventListener("click", listFunction);
  state.elements.collectionFilterPrice.forEach((price) => {
    price.addEventListener("change", async () => {
      updateUrlParams();
      fetchData();
    });
  });
  state.elements.paginationItems.forEach((item, index) => {
    item.addEventListener("click", async (e) => {
      e.preventDefault();
      setActivePagination(index);
      updateUrlParams();
      fetchData();
    });
  });
  state.elements.collectionFilterCheckbox.forEach((checkbox) => {
    checkbox.addEventListener("change", async () => {
      updateUrlParams();
      fetchData();
    });
  });
  state.elements.collectionButton.addEventListener("click", async () => {
    const productItem = await collectionLoadMore();
    renderCollections(productItem);
  });
};

const init = () => {
  cacheState();
  attachEventListeners();
};

onDocumentReady(init);

class AddToCart extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    onDocumentReady(() => {
      this.addToCart = this.querySelector("[data-component='add-to-cart']");
      this.init();
    });
  }

  init() {
    document.addEventListener("click", (e) => {
      addToCart(e);
    });
  }

  disconnectedCallback() {
    console.log("Disconnected Callback");
  }

  adoptedCallback() {
    console.log("Adopted Callback");
  }
}

customElements.define("add-to-cart", AddToCart);
