export const domParser = (data) => {
    const newInnerHtml = new DOMParser().parseFromString(data, "text/html");
    return newInnerHtml;
}