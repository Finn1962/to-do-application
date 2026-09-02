const express = require("express");

require("dotenv").config();

const path = require("path");

const session = require("express-session");

const app = express();

const { validateLogin } = require("./src/middlewares/validationLogin.js");

const { homeRouter } = require("./src/routers/homeRouter.js");

const { loginRouter } = require("./src/routers/loginRouter.js");

const { registerRouter } = require("./src/routers/registerRouter.js");

const { projectsRouter } = require("./src/routers/projectsRouter.js");

const { tasksRouter } = require("./src/routers/tasksRouter.js");

const { logoutRouter } = require("./src/routers/logoutRouter.js");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "./src/views"));

app.use(express.static(path.join(__dirname, "./src/public")));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  }),
);

app.use("/login", loginRouter);

app.use("/register", registerRouter);

app.use("/logout", logoutRouter);

app.use("/project", validateLogin, projectsRouter);

app.use("/task", validateLogin, tasksRouter);

app.use("/", validateLogin, homeRouter);

module.exports = { app };
