const registerForm = document.querySelector("form");
const passwordInput = document.querySelector("[name='password']");
const confirmPasswordInput = document.querySelector("[name='confirmPassword']");

passwordInput.addEventListener("input", () => {
  confirmPasswordInput.setCustomValidity("");
});

confirmPasswordInput.addEventListener("input", () => {
  confirmPasswordInput.setCustomValidity("");
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (passwordInput.value !== confirmPasswordInput.value) {
    confirmPasswordInput.setCustomValidity("Passwords do not match.");
  } else {
    registerForm.submit();
  }
});
