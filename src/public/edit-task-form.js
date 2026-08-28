const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch("/task/edit", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
    }),
  })
    .then(
      () =>
        (window.location.href = `/?projectId=${data.projectId}&taskId=${data.taskId}`),
    )
    .catch((error) => {
      console.error(error);
    });
});
