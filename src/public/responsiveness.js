const menuButton = document.querySelector(".burger-button");
const menuContainer = document.querySelector(".menu");
const tasksListContainer = document.querySelector(".tasks-list");
const taskDescription = document.querySelector(".description-container");
const addButtons = document.querySelectorAll(".add-button");

let descriptionIsVisible = false;
let menuIsVisible = false;

function showTaskDescription() {
  descriptionIsVisible = true;
  taskDescription.classList.replace("d-none", "d-block");
  taskDescription.classList.add("min-vw-100");
}

function hiddeTaskDescription() {
  descriptionIsVisible = false;
  taskDescription.classList.add("d-none");
  taskDescription.classList.remove("min-vw-100");
}

function showMenuContainer() {
  menuIsVisible = true;
  menuContainer.classList.replace("d-none", "d-flex");
  menuContainer.style.maxWidth = "992px";
  menuContainer.style.width = "100%";
  addButtons.forEach((button) => button.classList.add("d-none"));
}

function hiddeMenuContainer() {
  menuIsVisible = false;
  menuContainer.classList.replace("d-flex", "d-none");
  menuContainer.removeAttribute("style");
  addButtons.forEach((button) => button.classList.remove("d-none"));
}

menuButton.addEventListener("click", () => {
  if (!menuIsVisible === true) {
    showMenuContainer();
    hiddeTaskDescription();
  } else {
    hiddeMenuContainer();
  }
});

menuContainer.addEventListener("click", (event) => {
  const projectButton = event.target.closest(".nav-link");
  if (!projectButton) return;
  menuButton.checked = false;
  hiddeMenuContainer();
});

tasksListContainer.addEventListener("click", (event) => {
  const targetTask = event.target.closest("a");
  if (!targetTask) return;
  if (!descriptionIsVisible && window.innerWidth <= 768) showTaskDescription();
});

taskDescription.addEventListener("click", (event) => {
  const backButton = event.target.closest(".button-back");
  if (!backButton) return;
  hiddeTaskDescription();
});

window.addEventListener("resize", () => {
  if (menuIsVisible) {
    hiddeMenuContainer();
    menuButton.checked = false;
  }
  if (descriptionIsVisible) {
    hiddeTaskDescription();
  }
});
