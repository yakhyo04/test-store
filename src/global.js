import "./global.scss";
import { onDocumentReady } from "./utils/dom";

const variable = " Test ";
console.log(variable);

onDocumentReady(() => {
    console.log(variable)
})