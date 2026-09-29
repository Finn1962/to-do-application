import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

let DOMPurify;

function getDOMPurify() {
  if (!DOMPurify) {
    const window = new JSDOM("").window;
    DOMPurify = createDOMPurify(window);
  }
  return DOMPurify;
}

function sanitizeHtml(dirtyHtml) {
  if (!dirtyHtml) return "";
  return getDOMPurify().sanitize(dirtyHtml);
}

export { sanitizeHtml };
