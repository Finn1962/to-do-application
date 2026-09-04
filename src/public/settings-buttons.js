function setupFormState(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const inputs = Array.from(form.querySelectorAll("input"));

  const initialValues = inputs.map((input) => input.value);

  function checkChanges() {
    const hasChanges = inputs.some(
      (input, index) => input.value !== initialValues[index],
    );
    submitButton.style.display = hasChanges ? "block" : "none";
  }

  inputs.forEach((input) => {
    input.addEventListener("input", checkChanges);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupFormState(".username-and-mail-form");
  setupFormState(".password-form");
});
