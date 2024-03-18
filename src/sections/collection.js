import './styles/collection.scss';
import { onDocumentReady } from '../utils/dom';

// function collection(){
//     const sortBy = document.getElementById("SortBy");
//     const url = new URL(window.location.href);
//     const collectionFilterCheckbox = document.querySelectorAll(".collectionFilter input[type='checkbox']");
//     const collectionGrid = document.getElementById("CollectionGrid");

//     function resultData(data){
//         const newInnerHtml = new DOMParser()
//         .parseFromString(data, 'text/html')
//         .getElementById("CollectionGrid").innerHTML;
        
//         collectionGrid.innerHTML = newInnerHtml;
//     }

//     function addToParam(name, value){
//         url.searchParams.set(name, value)
//         window.history.pushState({}, "", url)
//     }

//     async function fetchData() {
//         const res = await fetch(url)
//         const data = await res.text();

//         if(data) {
//             resultData(data);
//         }
//     }

//     sortBy.addEventListener("change", async (e) => {
//         addToParam(e.target.name, e.target.value);

//         fetchData();
//     })

//     collectionFilterCheckbox.forEach(function(checkbox){
//         checkbox.addEventListener("change", async function(){
//             if (this.checked) {
//                 const name = this.getAttribute('name');
//                 const value = this.getAttribute('value');

//                 addToParam(name, value);

//                 fetchData()
//             } else {
//                 const name = this.getAttribute('name');
//                 const value = this.getAttribute('value');

//                 url.searchParams.delete(name, value)
//                 window.history.pushState({}, "", url)

//                 fetchData()
//             }
//         })
//     });
// }

// document.addEventListener("DOMContentLoaded", collection);

const state = {
    elements: {}
}

const cacheState = () => {
    state.elements = {
        sortBy: document.getElementById("SortBy"), 
        url: new URL(window.location.href),
        collectionFilterCheckbox: document.querySelectorAll(".collectionFilter input[type='checkbox']"),
        collectionGrid: document.getElementById("CollectionGrid")
    }
}

const resultData = (data) => {
    const newInnerHtml = new DOMParser()
    .parseFromString(data, 'text/html')
    .getElementById("CollectionGrid").innerHTML;

    state.elements.collectionGrid.innerHTML = newInnerHtml;
}

const addToParam = (name, value) => {
    state.elements.url.searchParams.set(name, value)
    window.history.pushState({}, "", state.elements.url)
}

const fetchData = async () => {
    const res = await fetch(state.elements.url);
    const data = await res.text();

    if(data){
        resultData(data);
    }
}

const sortFunction = async (e) => {
    addToParam(e.target.name, e.target.value);

    fetchData();
}

const filterFunction = () => {
    state.elements.collectionFilterCheckbox.forEach(function(checkbox){
        checkbox.addEventListener("change", async function(){
        if(this.checked){
            const name = this.getAttribute('name');
            const value = this.getAttribute('value');

            addToParam(name, value);

            fetchData()
        }else{
            const name = this.getAttribute('name');
            const value = this.getAttribute('value');

            state.elements.url.searchParams.delete(name, value)
            window.history.pushState({}, "", state.elements.url)

            fetchData()
        }
    })
    })
}

const attachEventListeners = () => {
    state.elements.sortBy.addEventListener("change", sortFunction)
}

const init = () => {
    cacheState();
    sortFunction();
    filterFunction();
    attachEventListeners();
}

// document.addEventListener("DOMContentLoaded", init);
onDocumentReady(init);