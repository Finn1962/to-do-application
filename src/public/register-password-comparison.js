const passwordForm =
  document.querySelector(".password-form") || document.querySelector("form");
const passwordInput = document.querySelector("[name='password']");
const confirmPasswordInput = document.querySelector("[name='confirmPassword']");

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
    passwordForm.submit();
  }
});
