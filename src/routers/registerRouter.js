const express = require("express");

const { body, validationResult } = require("express-validator");

const { hashPassword } = require("../middlewares/hash.js");

const { Users } = require("../db/queries.js");

const registerRouter = express.Router();

registerRouter.get("/", (req, res) => {
  res.send();
});

registerRouter.post(
  "/",
  [
    body("username").notEmpty(),
    body("password").notEmpty().isLength({ min: 8 }),
    body("confirmPassword").notEmpty().isLength({ min: 8 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwörter stimmen nicht überein");
      }
      return true;
    }),
  ],

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).end();
    else next();
  },

  async (req, res) => {
    await Users.createUser(
      req.body.username,
      await hashPassword(req.body.password),
    );
    res.send();
  },
);

module.exports = { registerRouter };
