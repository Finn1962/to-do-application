import express from "express";

import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesRouter = express.Router();

imagesRouter.get("/logo-var-three", (req, res) => {
  const imagePath = path.join(__dirname, "..", "public", "logo-var-three.svg");

  res.sendFile(imagePath, (error) => {
    if (error) res.status(404).send("Image not found!");
  });
});

export { imagesRouter };
