const express = require("express");

const { body, matchedData, query, param } = require("express-validator");

const { hashPassword } = require("../middlewares/hash.js");

const { Mails } = require("../services/mailer.js");

const { validateInputs } = require("../middlewares/validationInputs.js");

const { addSampleProject } = require("../utils/sampleProjects.js");

const { Users } = require("../db/queries.js");

const registerRouter = express.Router();

registerRouter.get("/", (req, res) => {
  res.render("register", {});
});

registerRouter.post(
  "/",

  [
    body("username").notEmpty(),
    body("email").notEmpty().isEmail().trim().normalizeEmail(),
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
    const data = matchedData(req);

    try {
      const { verification_token, id: userId } = await Users.createUser({
        name: data.username,
        email: data.email,
        password: await hashPassword(data.password),
      });

      addSampleProject(userId);

      Mails.sendVerification({
        username: data.username,
        email: data.email,
        verificationToken: verification_token,
      });

      res.render("verificationForm", { userId });
    } catch (error) {
      console.error(error);
      if (error.code === "23505" && error.constraint === "users_username_key")
        res.render("register", {
          error: "Username is already taken.",
          data: { username: data.username, email: data.email },
        });
      if (error.code === "23505" && error.constraint === "users_email_key")
        res.render("register", {
          error: "Email is already taken.",
          data: { username: data.username, email: data.email },
        });
    }
  },
);

registerRouter.get(
  "/verification",

  [
    query("verificationToken").isInt({ min: 1 }).toInt(),
    query("userId").isInt({ min: 1 }).toInt(),
  ],

  validateInputs,

  async (req, res) => {
    const { verificationToken, userId } = matchedData(req);
    const success = await Users.activateUserAccount(verificationToken, userId);
    if (success) {
      res.redirect("/login");
    } else {
      res.render("verificationForm", {
        userId,
        error: "The verification code is incorrect.",
      });
    }
  },
);

registerRouter.patch(
  "/newVerificationToken",

  [body("userId").isInt({ min: 1 }).toInt()],

  validateInputs,

  async (req, res) => {
    const { userId } = matchedData(req);

    const { verification_token, email, username } =
      await Users.generateNewVerificationToken(userId);

    Mails.sendVerification({
      username: username,
      email: email,
      verificationToken: verification_token,
    });

    res.send(200).end();
  },
);

registerRouter.get("/forgotPassword", (req, res) => {
  res.render("forgotPassword");
});

registerRouter.post(
  "/forgotPassword",

  body("email").notEmpty().isEmail().trim().normalizeEmail(),

  validateInputs,

  async (req, res) => {
    const { email } = matchedData(req);

    const userData = await Users.getUserDataByEmail(email);

    if (typeof userData === "undefined")
      return res.render("forgotPassword", {
        error: "Email address not registered",
      });

    const { verification_token, username } =
      await Users.generateNewVerificationToken(userData.id);

    Mails.sendPasswordReset({
      username: username,
      userId: userData.id,
      email,
      verificationToken: verification_token,
    });

    res.redirect("/login");
  },
);

registerRouter.get(
  "/resetPassword/:userId/:verificationToken",

  [
    param("userId").isInt({ min: 1 }).toInt(),
    param("verificationToken").isInt({ min: 1 }).toInt(),
  ],

  validateInputs,

  (req, res) => {
    const { verificationToken, userId } = matchedData(req);
    res.render("resetPassword", { verificationToken, userId });
  },
);

registerRouter.patch(
  "/resetPassword",

  [
    body("userId").isInt({ min: 1 }).toInt(),
    body("verificationToken").isInt({ min: 1 }).toInt(),
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
    const { password, verificationToken, userId } = matchedData(req);
    const foundToken = await Users.changePasswordHashWhereTocken({
      passwordHash: await hashPassword(password),
      verificationToken,
      userId,
    });
    if (foundToken) {
      const { username, email } = await Users.getUserDataByUserId(userId);
      Mails.sendPasswordChanged({
        username,
        email,
      });
      res.status(200).end();
    } else {
      res.status(400).end();
    }
  },
);

module.exports = { registerRouter };
