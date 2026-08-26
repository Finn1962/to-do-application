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
    if (!req.body.username || !req.body.password) {
      return res.status(401).end();
    }

    const userData = await Users.getUserDataByUsername(req.body.username);

    const isMatch = await comparePassword(
      req.body.password,
      userData.password_hash,
    );

    if (isMatch) {
      req.session.user = {
        name: userData.username,
        id: userData.id,
      };
      return res.redirect("/");
    }
    return res.status(401).end();
  },
);

module.exports = { loginRouter };
