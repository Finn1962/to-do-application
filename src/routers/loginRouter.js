const express = require("express");

const { comparePassword } = require("../middlewares/hash.js");

const { Users } = require("../db/queries/users.js");

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
  res.send();
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
        username: userData.username,
      };
      return res.redirect("/");
    }
    return res.status(401).end();
  },
);

module.exports = { loginRouter };
