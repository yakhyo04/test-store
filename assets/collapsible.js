function toggleAccordion(accordionItemHeader) {
    accordionItemHeader.classList.toggle("active");
    const accordionItem = accordionItemHeader.closest(".accordion-item");
    const accordionItemBody = accordionItem.querySelector(".accordion-item-body");
    if (accordionItemHeader.classList.contains("active")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
    } else {
      accordionItemBody.style.maxHeight = 0;
    }
  }
  
  const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");
  accordionItemHeaders.forEach(accordionItemHeader => {
    accordionItemHeader.addEventListener("click", () => {
      toggleAccordion(accordionItemHeader);
    });
  });