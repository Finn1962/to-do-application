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
      Users.deleteVerificationToken(userId);
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

registerRouter.get(
  "/resetPassword/:userId/:verificationToken",

  [
    param("verificationToken").isInt({ min: 1 }).toInt(),
    param("userId").isInt({ min: 1 }).toInt(),
  ],

  validateInputs,

  (req, res) => {
    const { verificationToken, userId } = matchedData(req);
    res.render("passwordReset", { verificationToken, userId });
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
    Users.changePasswordHash({
      passwordHash: await hashPassword(password),
      verificationToken,
      userId,
    });
    Users.deleteVerificationToken(userId);
    res.redirect("/");
  },
);

module.exports = { registerRouter };
