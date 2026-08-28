const deleteButtons = document.querySelector("[data-task-id]");

deleteButtons.addEventListener("click", async () => {
  fetch(`/task/delete/${deleteButtons.dataset.taskId}`, {
    method: "DELETE",
  })
    .then(
      () =>
        (window.location.href = `/?projectId=${deleteButtons.dataset.projectId}`),
    )
    .catch((error) => console.log(error));
});
