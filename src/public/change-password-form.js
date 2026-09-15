const passwordForm = document.querySelector(".password-form");
const passwordInput = document.querySelector("[name='password']");
const confirmPasswordInput = document.querySelector("[name='confirmPassword']");

passwordInput.addEventListener("input", () => {
  confirmPasswordInput.setCustomValidity("");
});

confirmPasswordInput.addEventListener("input", () => {
  confirmPasswordInput.setCustomValidity("");
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (passwordInput.value !== confirmPasswordInput.value) {
    confirmPasswordInput.setCustomValidity("Passwords do not match.");
    confirmPasswordInput.reportValidity();
    return;
  } else {
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch("/settings/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => window.location.reload());
    } catch (error) {
      console.error(error);
    }
  }
});
