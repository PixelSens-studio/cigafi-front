require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const mainRoutes = require("./routes/main.routes");
const userDashboardRoutes = require("./routes/userDashboard.routes");
const agentDashboardRoutes = require("./routes/agentDashboard.routes");
const adminDashboardRoutes = require("./routes/adminDashboard.routes");

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
// google and passport middlewares
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// app routes
app.use("/", mainRoutes);

app.use("/user", userDashboardRoutes); // for user dashboard pages
app.use("/agent", agentDashboardRoutes); // for user dashboard pages
//app.use("/user", userAccessRoutes); // for user dashboard pages
//
//
app.use("/admin", adminDashboardRoutes); // for user dashboard pages

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
