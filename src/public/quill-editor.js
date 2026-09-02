/* global Quill */

const quill = new Quill("#editor", {
  theme: "snow",
});

const quillForm = document.querySelector("form");
const hiddenInput = document.querySelector("#description");

quillForm.addEventListener("submit", () => {
  hiddenInput.value = quill.getSemanticHTML();
});
