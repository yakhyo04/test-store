const accordionContainer = document.getElementById("accordion__container");
const accordionButton = document.querySelector(".accordion__button");
const loader = document.getElementById("loader");

const showLoader = () => {
    loader.style.display = 'flex'
}

const hideLoader = () => {
    loader.style.display = 'none'
}

const getMarkup = async () => {
    try{
        showLoader();
        const response = await fetch('window.Shopify.routes.root' + "?sections=section-render");
        const data = await response.json();
        const markup = new DOMParser().parseFromString(data[`section-render`], "text/html");
        const items = markup.querySelectorAll("expended-accordion");
        return items;
    }catch(error){
        console.log(error)
    }finally{
        hideLoader();
    }
}

const renderMarkup = (items) => {
    items.forEach(item => accordionContainer.insertAdjacentElement("beforeend", item))
}

accordionButton.addEventListener("click", async() => {
    const markupItem = await getMarkup();
    renderMarkup(markupItem);
})