const express = require("express");

const path = require("path");

const session = require("express-session");

const app = express();

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "./src/views"));

app.use(
  session({
    secret: "mein-geheimes-geheimnis",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }, // true bei HTTPS in Produktion
  }),
);

app.get("/", (req, res) => {
  res.end();
});

module.exports = { app };
