const express = require("express");

const {
  body,
  //query,
  matchedData,
} = require("express-validator");

const projectsRouter = express.Router();

const { validateInputs } = require("../middlewares/validationInputs.js");

projectsRouter.get("/new", (req, res) => {
  res.status(200).end();
});

projectsRouter.post(
  "/new",

  [body("title").trim().notEmpty().escape()],

  validateInputs,

  async (req, res) => {
    const data = matchedData(req);

    /*await Tasks.createTask({
      title: data.title,
      description: data.description,
      userId: req.session.user.id,
    });*/

    res.redirect("/");
  },
);

module.exports = { projectsRouter };
