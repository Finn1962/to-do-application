const express = require("express");

const { comparePassword } = require("../middlewares/hash.js");

const { Users } = require("../db/queries.js");

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
  res.render("login", {});
});

loginRouter.post(
  "/",

  async (req, res) => {
    if (!req.body.usernameOrEmail || !req.body.password)
      return res.render("login", { error: "Invalid login details." });

    const userData =
      (await Users.getUserDataByUsername(req.body.usernameOrEmail)) ||
      (await Users.getUserDataByEmail(req.body.usernameOrEmail));

    if (!userData)
      return res.render("login", { error: "Invalid login details." });

    if (userData.is_verified === false)
      return res.render("verificationScreen", { userId: userData.id });

    const isMatch = await comparePassword(
      req.body.password,
      userData.password_hash,
    );

    if (isMatch) {
      req.session.user = {
        name: userData.username,
        id: userData.id,
      };
      res.redirect("/");
    } else {
      res.render("login", { error: "Invalid login details." });
    }
  },
);

module.exports = { loginRouter };
