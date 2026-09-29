import "dotenv/config";

import express from "express";

import path from "path";

import session from "express-session";

import {
  accountsCleanup,
  verificationTokenCleanup,
} from "./src/utils/cleanups.js";

import { validateLogin } from "./src/middlewares/validationLogin.js";

import { homeRouter } from "./src/routers/homeRouter.js";

import { loginRouter } from "./src/routers/loginRouter.js";

import { registerRouter } from "./src/routers/registerRouter.js";

import { projectsRouter } from "./src/routers/projectsRouter.js";

import { tasksRouter } from "./src/routers/tasksRouter.js";

import { logoutRouter } from "./src/routers/logoutRouter.js";

import { settingsRouter } from "./src/routers/settingsRouter.js";

import { imagesRouter } from "./src/routers/imagesRouter.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

accountsCleanup();
verificationTokenCleanup();

app.use("/login", loginRouter);

app.use("/register", registerRouter);

app.use("/logout", logoutRouter);

app.use("/images", imagesRouter);

app.use("/project", validateLogin, projectsRouter);

app.use("/task", validateLogin, tasksRouter);

app.use("/settings", validateLogin, settingsRouter);

app.use("/", validateLogin, homeRouter);

export { app };
