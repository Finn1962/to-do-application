const express = require("express");

const homeRouter = express.Router();

const { query, matchedData } = require("express-validator");

const { validateInputs } = require("../middlewares/validationInputs.js");

const { Projects, Tasks } = require("../db/queries.js");

homeRouter.get(
  "/",

  [
    query("projectId").optional().isInt({ min: 1 }).toInt(),
    query("taskId").optional().isInt({ min: 1 }).toInt(),
  ],

  validateInputs,

  async (req, res) => {
    const projects = await Projects.getAllProjectsByUserId(req.session.user.id);

    if (projects.length === 0)
      res.render("home", {
        projects: [],
        selectedProject: null,
        assignedTasks: [],
        selectedTask: null,
      });

    const { projectId, taskId } = matchedData(req);

    const selectedProject =
      (projectId && projects.find((project) => project.id === projectId)) ||
      projects[0];

    const assignedTasks = await Tasks.getAllTasksAssignedToProjectId(
      selectedProject.id,
      req.session.user.id,
    );

    const selectedTask =
      (taskId && assignedTasks.find((task) => task.id === taskId)) ||
      assignedTasks[0] ||
      null;

    res.render("home", {
      projects: projects,
      selectedProject: selectedProject,
      assignedTasks: assignedTasks,
      selectedTask: selectedTask,
    });
  },
);

module.exports = { homeRouter };
