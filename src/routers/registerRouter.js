const express = require("express");

const { body, validationResult } = require("express-validator");

const { hashPassword } = require("../middlewares/hash.js");

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
        throw new Error("Passwörter stimmen nicht überein");
      }
      return true;
    }),
  ],

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.render("register", {
        error: "Could not create an account. Please notify the operator.",
      });
    else next();
  },

  async (req, res) => {
    try {
      const verification_token = await Users.createUser({
        name: req.body.username,
        email: req.body.email,
        password: await hashPassword(req.body.password),
      });
      res.render("verificationScreen", {});
    } catch (error) {
      console.error(error);
      if (error.code === "23505" && error.constraint === "users_username_key")
        res.render("register", {
          error: "Username is already taken.",
          data: { username: req.body.username, email: req.body.email },
        });
      if (error.code === "23505" && error.constraint === "users_email_key")
        res.render("register", {
          error: "Email is already taken.",
          data: { username: req.body.username, email: req.body.email },
        });
    }
  },
);

module.exports = { registerRouter };
