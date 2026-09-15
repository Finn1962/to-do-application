const express = require("express");

const settingsRouter = express.Router();

const { Users } = require("../db/queries.js");

const { hashPassword } = require("../middlewares/hash.js");

const { body, matchedData } = require("express-validator");

const { validateInputs } = require("../middlewares/validationInputs.js");

settingsRouter.get("/", async (req, res) => {
  const userData = await Users.getUserDataByUsername(req.session.user.name);
  res.render("settings", { userData });
});

settingsRouter.patch(
  "/userdata",

  [
    body("username").notEmpty(),
    body("email").notEmpty().isEmail().trim().normalizeEmail(),
  ],

  validateInputs,

  async (req, res) => {
    const { username, email } = matchedData(req);
    Users.changeUserdata({
      username: username,
      email: email,
      userId: req.session.user.id,
    });
    req.session.user.name = username;
    res.status(200).end();
  },
);

settingsRouter.patch(
  "/password",

  [
    body("password").notEmpty().isLength({ min: 8, max: 32 }),
    body("confirmPassword").notEmpty().isLength({ min: 8, max: 32 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("passwords do not match");
      }
      return true;
    }),
  ],

  validateInputs,

  async (req, res) => {
    const { password } = matchedData(req);
    Users.changePasswordHash(await hashPassword(password), req.session.user.id);
    res.status(200).end();
  },
);

module.exports = { settingsRouter };
