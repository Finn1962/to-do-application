const express = require("express");

const { body, query, matchedData } = require("express-validator");

const tasksRouter = express.Router();

const { Tasks } = require("../db/queries.js");

const { validateInputs } = require("../middlewares/validationInputs.js");

tasksRouter.get(
  "/new",

  [query("projectId").isInt({ min: 1 }).toInt()],

  validateInputs,

  (req, res) => {
    const { projectId } = matchedData(req);
    res.render("newTaskForm", { projectId });
  },
);

tasksRouter.post(
  "/new",

  [
    body("title").trim().notEmpty().escape(),
    body("projectId").isInt({ min: 1 }).toInt(),
    body("description").optional().trim().escape(),
  ],

  validateInputs,

  async (req, res) => {
    const data = matchedData(req);

    await Tasks.createTask({
      userId: req.session.user.id,
      projectId: data.projectId,
      title: data.title,
      description: data.description,
    });

    res.redirect("/");
  },
);

tasksRouter.get(
  "/edit",

  [query("taskId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { taskId } = matchedData(req);
    const taskData = await Tasks.getTaskByTaskId(taskId, req.session.user.id);
    res.send(taskData);
  },
);

tasksRouter.put(
  "/edit",

  [
    body("taskId").isInt({ min: 1 }).toInt(),
    body("title").trim().notEmpty().escape(),
    body("description").optional().trim().escape(),
  ],

  validateInputs,

  async (req, res) => {
    const data = matchedData(req);

    await Tasks.editTask({
      taskId: data.taskId,
      title: data.title,
      description: data.description,
      userId: req.session.user.id,
    });

    res.redirect("/");
  },
);

tasksRouter.patch(
  "/complete",

  [
    body("taskId").isInt({ min: 1 }).toInt(),
    body("taskState").isBoolean().toBoolean(),
  ],

  validateInputs,

  async (req, res) => {
    const data = matchedData(req);

    await Tasks.completeTask({
      taskId: data.taskId,
      taskState: data.taskState,
      userId: req.session.user.id,
    });

    res.status(200).end();
  },
);

tasksRouter.get(
  "/delete",

  [query("taskId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { taskId } = matchedData(req);
    res.send(taskId);
  },
);

tasksRouter.delete(
  "/delete",

  [query("taskId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { taskId } = matchedData(req);
    Tasks.deleteTask(taskId, req.session.user.id);
    res.status(200).end();
  },
);

module.exports = { tasksRouter };
