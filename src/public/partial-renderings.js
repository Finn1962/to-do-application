const url = new URL(window.location.href);

const projectList = document.querySelector(".project-container");

const tasksList = document.querySelector(".tasks-list");

const descriptionContainer = document.querySelector(".description-container");

tasksList.addEventListener("click", async (event) => {
  const targetTask = event.target.closest("a");

  if (!targetTask) return;

  const [tasksListContent, taskDescriptionContent] = await Promise.all([
    fetch(
      `/renderTasks/${targetTask.dataset.projectId}/${targetTask.dataset.taskId}`,
    ),
    fetch(
      `/renderTaskDescription/${targetTask.dataset.projectId}/${targetTask.dataset.taskId}`,
    ),
  ]);

  tasksList.innerHTML = await tasksListContent.text();
  descriptionContainer.innerHTML = await taskDescriptionContent.text();

  url.searchParams.set("projectId", targetTask.dataset.projectId);
  url.searchParams.set("taskId", targetTask.dataset.taskId);
  window.history.pushState({}, "", url);
});

descriptionContainer.addEventListener("click", async (event) => {
  const targetCheckbox = event.target.closest("input");

  if (!targetCheckbox) return;

  await fetch("/task/complete", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      taskId: targetCheckbox.dataset.taskId,
      taskState: targetCheckbox.checked,
    }),
  });

  const tasksListContent = await fetch(
    `/renderTasks/${targetCheckbox.dataset.projectId}/${targetCheckbox.dataset.taskId}`,
  );

  tasksList.innerHTML = await tasksListContent.text();
});

projectList.addEventListener("click", async (event) => {
  const targetProject = event.target.closest("a");

  if (!targetProject) return;

  const [projectListContent, tasksListContent, taskDescriptionContent] =
    await Promise.all([
      fetch(`/renderProjects/${targetProject.dataset.projectId}`),
      fetch(`/renderTasks/${targetProject.dataset.projectId}/1`),
      fetch(`/renderTaskDescription/${targetProject.dataset.projectId}/1`),
    ]);

  projectList.innerHTML = await projectListContent.text();
  tasksList.innerHTML = await tasksListContent.text();
  descriptionContainer.innerHTML = await taskDescriptionContent.text();

  url.searchParams.set("projectId", targetProject.dataset.projectId);
  url.searchParams.set("taskId", 1);
  window.history.pushState({}, "", url);
});
