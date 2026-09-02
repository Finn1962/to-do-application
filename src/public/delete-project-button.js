const deleteButton = document.querySelector("#delete_project_button");

deleteButton.addEventListener("click", async () => {
  fetch(`/project/delete/${deleteButton.dataset.projectId}`, {
    method: "DELETE",
  })
    .then(() => (window.location.href = "/"))
    .catch((error) => console.log(error));
});
