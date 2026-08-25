const express = require("express");

require("dotenv").config();

const path = require("path");

const session = require("express-session");

const app = express();

const { loginRouter } = require("./src/routers/loginRouter.js");

const { registerRouter } = require("./src/routers/registerRouter.js");

const { projectsRouter } = require("./src/routers/projectsRouter.js");

const { tasksRouter } = require("./src/routers/tasksRouter.js");

const { validateLogin } = require("./src/middlewares/validationLogin.js");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "./src/views"));

app.use(express.json());

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

app.use("/register", registerRouter);

app.use("/project", projectsRouter);

app.use("/task", tasksRouter);

module.exports = { app };
