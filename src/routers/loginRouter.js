const express = require("express");

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
  res.send();
});

module.exports = { loginRouter };
