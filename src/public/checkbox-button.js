const checkboxButtons = document.querySelector(".ui-checkbox");

checkboxButtons.addEventListener("click", () => {
  fetch("/task/complete", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      taskId: checkboxButtons.dataset.taskId,
      taskState: checkboxButtons.checked,
    }),
  })
    .then(
      () =>
        (window.location.href = `/?projectId=${checkboxButtons.dataset.projectId}&taskId=${checkboxButtons.dataset.taskId}`),
    )
    .catch((error) => {
      console.error(error);
    });
});
