const tasks = document.querySelectorAll(".list-group-item");

tasks.forEach((task) => {
  task.addEventListener("click", (event) => {
    event.preventDefault();

    const targetURL = task.href;
    const scrollposition = window.scrollY;
    const newURL = `${targetURL}&scrollY=${scrollposition}`;
    window.location.href = newURL;
  });
});
