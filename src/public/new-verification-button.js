const newVerificationButton = document.querySelector(
  "#new_verification_button",
);

let counter = 30;
newVerificationButton.textContent = `Send new code in: ${counter}s`;

setInterval(() => {
  if (counter !== 0) {
    counter--;
    newVerificationButton.textContent = `Send new code in: ${counter}s`;
  } else {
    newVerificationButton.textContent = `Send new code`;
  }
}, 1000);

newVerificationButton.addEventListener("click", () => {
  if (counter === 0) {
    fetch("/register/new-verification-token", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: newVerificationButton.dataset.userId,
      }),
    });
    counter = 30;
  }
});
