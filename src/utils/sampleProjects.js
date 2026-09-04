const { Projects, Tasks } = require("../db/queries.js");

async function addSampleProject(userId) {
  const schoolProjectId = await Projects.createProject("School", userId);

  Tasks.createTask({
    userId,
    projectId: schoolProjectId,
    title: "Prepare the presentation",
    description: "<p>we have to make a presentation</p>",
  });
  Tasks.createTask({
    userId,
    projectId: schoolProjectId,
    title: "Do homework",
    description: "<p>I have homeworks</p>",
  }).then((taskId) => Tasks.completeTask({ taskState: true, taskId, userId }));
  Tasks.createTask({
    userId,
    projectId: schoolProjectId,
    title: "Buy materials",
    description: "<p>I need to buy materials for our project.</p>",
  });
}

module.exports = { addSampleProject };
