const passwordForm =
  document.querySelector(".password-form") || document.querySelector("form");
const passwordInput = document.querySelector("[name='password']");
const confirmPasswordInput = document.querySelector("[name='confirmPassword']");
const alertMessage = document.querySelector(".text-danger");

passwordInput.addEventListener("input", () => {
  confirmPasswordInput.setCustomValidity("");
});

confirmPasswordInput.addEventListener("input", () => {
  confirmPasswordInput.setCustomValidity("");
});

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (passwordInput.value !== confirmPasswordInput.value) {
    confirmPasswordInput.setCustomValidity("Passwords do not match.");
    confirmPasswordInput.reportValidity();
    return;
  } else {
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
      fetch("/register/resetPassword", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.status === 200) {
          console.log(1);
          window.location.href = "/login";
        } else if (response.status === 400) {
          console.log(2);
          alertMessage.classList.replace("d-none", "d-block");
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
});
