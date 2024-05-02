// function toggleAccordion(accordionItem) {
//     accordionItem.classList.toggle("active");
// }

// document.addEventListener("DOMContentLoaded", function () {
//     const accordionItems = document.querySelectorAll(".accordion-item");
//     accordionItems.forEach(accordionItem => {
//         const accordionItemHeader = accordionItem.querySelector(".accordion-item-header");
//         accordionItemHeader.addEventListener("click", () => {
//             toggleAccordion(accordionItem);
//         });
//     });
// });

// class Accordion {
//     constructor(accordionItem, onToggle) {
//       this.accordionItem = accordionItem;
//       this.headerElement = accordionItem.querySelector("[data-component='header']");
//       this.bodyElement = accordionItem.querySelector("[data-body='header']");
//       this.onToggle = onToggle || (() => {}); 
//       this.initializeAccordion();
//     }
  
//     toggleAccordion() {
//       this.accordionItem.classList.toggle("active");
//       this.onToggle(this.accordionItem);
//     }
  
//     initializeAccordion() {
//       this.headerElement.addEventListener("click", () => {
//         this.toggleAccordion();
//       });
//     }
//   }
  
//   document.addEventListener("DOMContentLoaded", function () {
//     const accordionItems = document.querySelectorAll("expended-accordion");
//     accordionItems.forEach(accordionItem => {
//       new Accordion(accordionItem, accordionItem => {
//         console.log("Accordion item:", accordionItem);
//       });
//     });
//   });

// const onDocumentReady = (callback) => (document.readyState === "complete" || document.readyState === "interactive"
//   ? setTimeout(callback, 1)
//   : document.addEventListener("DOMContentLoaded", callback));

const onDocumentReady = (callback) => (document.readyState === "complete" || document.readyState === "interactive"
  ? setTimeout(callback, 1)
  : document.addEventListener("DOMContentLoaded", callback));

class Collapsable extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    onDocumentReady(() => {
        this.headerElement = this.querySelector("[data-component='header']"); 
        this.bodyElement = this.querySelector("[data-body='header']");
        console.log("initialized");
        this.init();
    })
  }

  init(){
    this.headerElement.addEventListener("click", () => {
      console.log("clicked");
      this.toggle();
    });
  }

  toggle(){
    this.classList.toggle("active");
  }

  disconnectedCallback() {
    console.log('Disconnected Callback');
  }

  adoptedCallback() {
    console.log('Adopted Callback');
  }
}

customElements.define('expended-accordion', Collapsable)