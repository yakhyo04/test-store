import "./styles/collection.scss";
import { onDocumentReady } from "../utils/dom";
import { addToCart } from "../utils/addToCart";

const state = {
  elements: {},
};

const cacheState = () => {
  state.elements = {
    sortBy: document.getElementById("SortBy"),
    url: new URL(window.location.href),
    collectionFilterCheckbox: document.querySelectorAll(
      ".collectionFilter input[type='checkbox']",
    ),
    collectionFilterPrice: document.querySelectorAll(
      ".filter-group-display__price-range input[type='number']",
    ),
    paginationItems: document.querySelectorAll("[data-pagination-item]"),
    paginationLinks: document.querySelectorAll("[data-pagination-link]"),
    collectionGrid: document.getElementById("CollectionGrid"),
    collectionButton: document.querySelector(".collection__load--button"),
    svgImage: `<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.47297 0.806635C9.411 0.744149 9.33726 0.694553 9.25602 0.660707C9.17479 0.626861 9.08765 0.609436 8.99964 0.609436C8.91163 0.609436 8.8245 0.626861 8.74326 0.660707C8.66202 0.694553 8.58828 0.744149 8.52631 0.806635L3.55964 5.77997L1.47297 3.68663C1.40863 3.62448 1.33267 3.5756 1.24943 3.5428C1.16619 3.50999 1.07731 3.49391 0.987856 3.49546C0.898402 3.497 0.810129 3.51615 0.728077 3.55182C0.646025 3.58748 0.5718 3.63895 0.509641 3.7033C0.447482 3.76765 0.398606 3.84361 0.365803 3.92685C0.333001 4.01008 0.316914 4.09897 0.318461 4.18842C0.320009 4.27787 0.339161 4.36615 0.374823 4.4482C0.410485 4.53025 0.46196 4.60448 0.526308 4.66664L3.08631 7.22663C3.14828 7.28912 3.22202 7.33872 3.30326 7.37256C3.3845 7.40641 3.47163 7.42383 3.55964 7.42383C3.64765 7.42383 3.73479 7.40641 3.81603 7.37256C3.89726 7.33872 3.971 7.28912 4.03297 7.22663L9.47297 1.78664C9.54064 1.72421 9.59465 1.64844 9.63159 1.56411C9.66852 1.47977 9.6876 1.3887 9.6876 1.29664C9.6876 1.20457 9.66852 1.1135 9.63159 1.02916C9.59465 0.944831 9.54064 0.869063 9.47297 0.806635Z" fill="#FF3EB2"/>
            </svg>`,
    filterButton: document.querySelector(".collection__filter--button"),
    filterWrapper: document.querySelector(".collection__filters"),
    collectionOverlay: document.querySelector(".collection__overlay"),
    body: document.querySelector("body"),
    filterCloseButton: document.querySelector(
      ".collection__filters .icons__wrapper--span",
    ),
    defaultPage: 2,
    iconGrid: document.querySelector(".icon__grid"),
    iconList: document.querySelector(".icon__list"),
    collectionProduct: document.querySelectorAll(".collection__product"),
    sortResult: 'created-ascending',
    filterResult: '',
    filterPriceResult: '',
    paginateBtn: document.querySelectorAll(".collection__paginate--btn"),
  };
};

const pageValue = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get('page');
  let resultData = 2;
  state.elements.defaultPage = resultData;

  if(value == null){
    resultData = 2;
  }else{
    resultData = value + 1;
  }
}

const hidingPaginateBtn = () => {
  state.elements.paginateBtn.forEach((a) => {
    a.style.display = 'none'
  })
}

const showingPaginateBtn = () => {
  state.elements.paginateBtn.forEach((a) => {
    a.style.display = 'block'
  })
}

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
    console.log("items: ", items.length);
    if(items.length == 0){
      hidingPaginateBtn();
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
        if(index !== itemIndex){
            paginationItem.classList.add("pagination__content--number");
            return
        }
        paginationItem.classList.add("pagination__content--link")
    })
}

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
      state.elements.filterResult = `${name + '=' + value}`;
      params.append(name, value);
    }
  });

  state.elements.collectionFilterPrice.forEach((price) => {
    state.elements.defaultPage = 2;
    showingPaginateBtn();
    const name = price.getAttribute("name");
    state.elements.filterPriceResult = `${name + '=' + price.value}`;
    params.set(name, price.value);
  });

  const paginationItems = state.elements.paginationItems;
  for (let i = 0; i < paginationItems.length; i++) {
    const item = paginationItems[i];
    if (item.classList.contains('pagination__content--link')) {
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
  state.elements.collectionGrid.style.opacity = 0.4;
  const res = await fetch(state.elements.url);
  const data = await res.text();

  if (data) {
    state.elements.collectionGrid.style.opacity = 1;
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
      console.log("hello");
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
      console.log("inital");
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
