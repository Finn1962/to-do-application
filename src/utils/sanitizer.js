let DOMPurify;

function getDOMPurify() {
  if (!DOMPurify) {
    const createDOMPurify = require("dompurify");
    const { JSDOM } = require("jsdom");
    const window = new JSDOM("").window;
    DOMPurify = createDOMPurify(window);
  }
  return DOMPurify;
}

function sanitizeHtml(dirtyHtml) {
  if (!dirtyHtml) return "";
  return getDOMPurify().sanitize(dirtyHtml);
}

module.exports = { sanitizeHtml };
