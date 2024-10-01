export default function handleActiveItem (items, activeIndex, className){
    items.forEach((item) => item.classList.remove(className));
    items[activeIndex].classList.add(className);
}