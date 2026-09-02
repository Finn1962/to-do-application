const express = require("express");

const { body, query, param, matchedData } = require("express-validator");

const tasksRouter = express.Router();

const { Tasks } = require("../db/queries.js");

const { validateInputs } = require("../middlewares/validationInputs.js");

const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

tasksRouter.get(
  "/new/:projectId",

  [param("projectId").isInt({ min: 1 }).toInt()],

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
    body("description").customSanitizer((value) => {
      return DOMPurify.sanitize(value);
    }),
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

    res.redirect(`/?projectId=${data.projectId}`);
  },
);

tasksRouter.get(
  "/edit/:taskId",

  [
    param("taskId").isInt({ min: 1 }).toInt(),
    query("projectId").optional().isInt({ min: 1 }).toInt(),
  ],

  validateInputs,

  async (req, res) => {
    const { taskId, projectId } = matchedData(req);
    const taskData = await Tasks.getTaskByTaskId(taskId, req.session.user.id);
    res.render("editTaskForm", { taskData, taskId, projectId });
  },
);

tasksRouter.put(
  "/edit",

  [
    body("taskId").isInt({ min: 1 }).toInt(),
    body("projectId").optional().isInt({ min: 1 }).toInt(),
    body("title").trim().notEmpty().escape(),
    body("description")
      .trim()
      .customSanitizer((value) => {
        return DOMPurify.sanitize(value);
      }),
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

    res.status(200).end();
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
  "/delete/:taskId",

  [
    param("taskId").isInt({ min: 1 }).toInt(),
    query("projectId").optional().isInt({ min: 1 }).toInt(),
  ],

  validateInputs,

  async (req, res) => {
    const { taskId, projectId } = matchedData(req);
    res.render("confirmDeleteTask", { taskId, projectId });
  },
);

tasksRouter.delete(
  "/delete/:taskId",

  [param("taskId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { taskId } = matchedData(req);
    await Tasks.deleteTask(taskId, req.session.user.id);
    res.status(200).end();
  },
);

module.exports = { tasksRouter };
