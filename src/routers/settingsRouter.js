import express from "express";

import { Users } from "../db/queries.js";

import { Mails } from "../services/mailer.js";

import { hashPassword } from "../middlewares/hash.js";

import { body, matchedData } from "express-validator";

import { validateInputs } from "../middlewares/validationInputs.js";

const settingsRouter = express.Router();

settingsRouter.get("/", async (req, res) => {
  const userData = await Users.getUserDataByUsername(req.session.user.name);
  res.render("settings", { userData });
});

settingsRouter.patch(
  "/username",

  [body("username").notEmpty()],

  validateInputs,

  async (req, res) => {
    const { username } = matchedData(req);
    Users.changeUsername({
      username: username,
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
    Mails.sendPasswordChanged({
      username: req.session.user.name,
      email: req.session.user.email,
    });
    res.status(200).end();
  },
);

export { settingsRouter };
