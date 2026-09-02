const deleteButton = document.querySelector("#delete_task_button");

deleteButton.addEventListener("click", async () => {
  fetch(`/task/delete/${deleteButton.dataset.taskId}`, {
    method: "DELETE",
  })
    .then(
      () =>
        (window.location.href = `/?projectId=${deleteButton.dataset.projectId}`),
    )
    .catch((error) => console.log(error));
});
