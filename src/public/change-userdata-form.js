const userdataForm = document.querySelector(".userdata-form");

userdataForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    await fetch("/settings/userdata", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => window.location.reload());
  } catch (error) {
    console.error(error);
  }
});
