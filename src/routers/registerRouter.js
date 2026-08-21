const express = require("express");

const { hashPassword } = require("../middlewares/hash.js");

const { Users } = require("../db/queries/users.js");

const registerRouter = express.Router();

registerRouter.get("/", (req, res) => {
  res.send();
});

module.exports = { registerRouter };
