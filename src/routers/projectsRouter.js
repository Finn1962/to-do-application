const express = require("express");

const { body, query, matchedData } = require("express-validator");

const projectsRouter = express.Router();

const { validateInputs } = require("../middlewares/validationInputs.js");

const { Projects } = require("../db/queries.js");

projectsRouter.get("/new", (req, res) => {
  res.render("newProjectForm");
});

projectsRouter.post(
  "/new",

  [body("title").trim().notEmpty().escape()],

  validateInputs,

  async (req, res) => {
    const data = matchedData(req);
    await Projects.createProject(data.title, req.session.user.id);
    res.redirect("/");
  },
);

projectsRouter.post(
  "/new",

  [body("title").trim().notEmpty().escape()],

  validateInputs,

  async (req, res) => {
    const data = matchedData(req);
    await Projects.createProject(data.title, req.session.user.id);
    res.redirect("/");
  },
);

projectsRouter.get(
  "/edit",

  [query("projectId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { projectId } = matchedData(req);
    const taskData = await Projects.getProjectByProjectId(
      projectId,
      req.session.user.id,
    );

    res.send(taskData);
  },
);

projectsRouter.put(
  "/edit",

  [
    body("projectId").isInt({ min: 1 }).toInt(),
    body("title").trim().notEmpty().escape(),
  ],

  validateInputs,

  async (req, res) => {
    const data = matchedData(req);

    await Projects.editProject({
      projectId: data.projectId,
      title: data.title,
      userId: req.session.user.id,
    });

    res.redirect("/");
  },
);

projectsRouter.get(
  "/delete",

  [query("projectId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { projectId } = matchedData(req);
    res.send(projectId);
  },
);

projectsRouter.delete(
  "/delete",

  [query("projectId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { projectId } = matchedData(req);
    Projects.deleteTask(projectId, req.session.user.id);
    res.status(200).end();
  },
);

module.exports = { projectsRouter };
