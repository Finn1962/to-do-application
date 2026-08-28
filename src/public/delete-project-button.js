const deleteButton = document.querySelector("[data-project-id]");

deleteButton.addEventListener("click", async () => {
  fetch(`/project/delete/${deleteButton.dataset.projectId}`, {
    method: "DELETE",
  })
    .then(() => (window.location.href = "/"))
    .catch((error) => console.log(error));
});
