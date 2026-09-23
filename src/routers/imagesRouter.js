const express = require("express");

const path = require("path");

const imagesRouter = express.Router();

imagesRouter.get("/logo-var-three", (req, res) => {
  const imagePath = path.join(__dirname, "..", "public", "logo-var-three.svg");

  res.sendFile(imagePath, (error) => {
    if (error) res.status(404).send("Image not found!");
  });
});

module.exports = { imagesRouter };
