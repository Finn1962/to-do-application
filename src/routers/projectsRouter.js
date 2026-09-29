import express from "express";

import { body, matchedData, param } from "express-validator";

import { validateInputs } from "../middlewares/validationInputs.js";

import { Projects } from "../db/queries.js";

const projectsRouter = express.Router();

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
  "/edit/:projectId",

  [param("projectId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { projectId } = matchedData(req);
    const taskData = await Projects.getProjectByProjectId(
      projectId,
      req.session.user.id,
    );
    res.render("editProjectForm", { taskData, projectId });
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

    res.status(200).end();
  },
);

projectsRouter.get(
  "/delete/:projectId",

  [param("projectId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { projectId } = matchedData(req);
    res.render("confirmDeleteProject", { projectId });
  },
);

projectsRouter.delete(
  "/delete/:projectId",

  [param("projectId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { projectId } = matchedData(req);
    await Projects.deleteTask(projectId, req.session.user.id);
    res.status(200).end();
  },
);

export { projectsRouter };
