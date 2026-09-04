const express = require("express");

const settingsRouter = express.Router();

settingsRouter.get("/", (req, res) => {
  res.render("settings", {});
});

module.exports = { settingsRouter };
