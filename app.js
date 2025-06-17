import dotenv from "dotenv";
import createError from "http-errors";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import fs from 'fs';

import mainRoutes from "./routes/main.routes.js";
import userDashboardRoutes from "./routes/userDashboard.routes.js";
import agentDashboardRoutes from "./routes/agentDashboard.routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
import userAuthRoutes from "./routes/userAuth.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initiate app
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// CORS Options
const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// app parameters and middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


 
 
// app routes
app.use("/", mainRoutes);
app.use("/auth", userAuthRoutes); // for user authentication

app.use("/user", userDashboardRoutes); // for user dashboard pages
app.use("/agent", agentDashboardRoutes); // for user dashboard pages
//app.use("/user", userAccessRoutes); // for user dashboard pages
//
//
app.use("/admin", adminAuthRoutes); // for admin authentication
app.use("/admin", adminDashboardRoutes); // for user dashboard pages


export default app;
