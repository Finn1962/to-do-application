const express = require("express");

const logoutRouter = express.Router();

logoutRouter.get("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.status(500).end();
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

module.exports = { logoutRouter };
