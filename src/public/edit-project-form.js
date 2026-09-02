const editForm = document.querySelector("form");

editForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(editForm);
  const data = Object.fromEntries(formData.entries());

  fetch("/project/edit", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
    }),
  })
    .then(() => (window.location.href = `/?projectId=${data.projectId}`))
    .catch((error) => {
      console.error(error);
    });
});
