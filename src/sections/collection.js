import "./styles/collection.scss";
import { onDocumentReady } from "../utils/dom";
import { addToCart } from "../utils/addToCart";
import { domParser } from "../utils/domParser";

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
}

customElements.define("add-to-cart", AddToCart);

const state = {
  elements: {},
  queryParams: {},
  queryParam: new URLSearchParams(window.location.search)
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
  };
  state.queryParams = {
    url: new URL(window.location.href),
    page: 2,
    paramQueries: ['sort_by', 'filter.v.price.gte', 'filter.v.price.lte', 'page']
  }
};

const togglePaginateBtns = (force) => {
  state.elements.paginateBtn.forEach((a) => {
    a.classList.toggle("active", force)
  })
}

const toggleCollectionGrid = (force) => {
  state.elements.collectionGrid.classList.toggle("active", force);
}

const toggleFilterDrawer = (force) => {
  document.body.classList.toggle("filter__drawer--open", force);
}

const resultData = (data) => {
  const newInnerHtml = domParser(data).getElementById("CollectionGrid").innerHTML;
  state.elements.collectionGrid.innerHTML = newInnerHtml;
}

const updatePagination = (value) => {
  if(!value.dataset.next){
    togglePaginateBtns(true);
  }else{
    state.elements.paginateNext = value.dataset.next;
  }
}

const onGridLayoutChange = (e) => {
  const layoutType = e.currentTarget.dataset.layoutType || "list";
  state.elements.collectionGrid.dataset.layout = layoutType;
}

const fetchDataURL = async (url) => {
  try{
    toggleCollectionGrid(true);
    const response = await fetch(url);
    const data = await response.text();
    return data;
  }catch(error){
    console.error(error);
    return null;
  }finally{
    toggleCollectionGrid(false);
  }
}

const fetchData = async () => {
  toggleCollectionGrid(true);
  const data = await fetchDataURL(state.queryParams.url);
  if (data) {
  toggleCollectionGrid(false);
    resultData(data);
  }
};

const setParams = (name, value) => {
  const params = state.queryParam;

  if(params.has(name, value)){
    params.delete(name, value);
  }else{
    if(state.queryParams.paramQueries.includes(name)){
      params.set(name, value);
    }else{
      params.append(name, value);
    }
  }

  state.queryParams.url.search = params.toString();

  const paramsURL = state.queryParams.url.href;

  window.history.pushState({}, "", paramsURL);

  return paramsURL; 
}

const collectionLoadMore = async () => {
  try {
    setParams('page', state.queryParams.page);
    const params = state.queryParam.toString();
    const url = `${window.location.pathname}?section=${window.sectionId}&${params}`;
    const data = await fetchDataURL(url);
    const collectionsWrapper = domParser(data);
    const items = collectionsWrapper.querySelectorAll(".collection__product");
    setParams('page', state.queryParams.page);
    state.queryParams.page += 1;
    updatePagination(collectionsWrapper.querySelector(".collection__grid--wrapper"));

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

const onSortAndFilterChange = (e) => {
  const name = e.target.attributes.name.value;
  const { value } = e.target;

  setParams(name, value);

  fetchData();

  state.queryParams.page = 2;
  togglePaginateBtns(false);
}

const attachEventListeners = () => {
  state.elements.filterButton.addEventListener("click", () => toggleFilterDrawer(true));
  state.elements.collectionOverlay.addEventListener("click", () => toggleFilterDrawer(false));
  state.elements.filterCloseButton.addEventListener("click", () => toggleFilterDrawer(false));
  state.elements.iconGrid.addEventListener("click", onGridLayoutChange);
  state.elements.iconList.addEventListener("click", onGridLayoutChange);
  state.elements.collectionButton.addEventListener("click", async () => {
    const productItem = await collectionLoadMore();
    renderCollections(productItem);
  });
  state.elements.sortBy.addEventListener("change", (e) => {
    onSortAndFilterChange(e);
  });
  state.elements.collectionFilterPrice.forEach((price) => {
    price.addEventListener("change", async (e) => {
      onSortAndFilterChange(e);
    });
  });
  state.elements.collectionFilterCheckbox.forEach((checkbox) => {
    checkbox.addEventListener("change", async (e) => {
      onSortAndFilterChange(e);
    });
  });
};

const init = () => {
  cacheState();
  attachEventListeners();
};

onDocumentReady(init);