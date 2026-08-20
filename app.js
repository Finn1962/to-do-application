const express = require("express");

const path = require("path");

const session = require("express-session");

const app = express();

const { loginRouter } = require("./src/routers/loginRouter.js");

const { validateLogin } = require("./src/middlewares/validation.js");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "./src/views"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  }),
);

app.get("/", validateLogin, (req, res) => {
  console.log("index aufgerufen");
  res.end();
});

app.use("/login", loginRouter);

module.exports = { app };
