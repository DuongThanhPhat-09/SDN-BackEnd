const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

const quizzesRouter = require("./routes/quizzes");
const questionsRouter = require("./routes/questions");
const usersRouter = require("./routes/users");
const user = require("./models/user");

const app = express();

app.use(
  cors({
    origin:
      "https://sdn-assignment4-ceato2tp9-phats-projects-e7de95df.vercel.app/login",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/quizzes", quizzesRouter);
app.use("/questions", questionsRouter);
app.use("/users", usersRouter);

// 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler (trả JSON)
app.use(function (err, req, res, next) {
  console.error(err);

  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

module.exports = app;
