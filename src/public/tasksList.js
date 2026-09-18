const tasksList = document.querySelector(".tasks-list");

tasksList.addEventListener("click", async (event) => {
  const targetTask = event.target.closest("a");
  const href = targetTask.dataset.href;
  const response = await fetch(href);
  const htmlContent = await response.text();
  tasksList.innerHTML = htmlContent;
});
