const express = require("express");

const settingsRouter = express.Router();

const { Users } = require("../db/queries.js");

settingsRouter.get("/", async (req, res) => {
  const userData = await Users.getUserDataByUsername(req.session.user.name);
  res.render("settings", { userData });
});

module.exports = { settingsRouter };
