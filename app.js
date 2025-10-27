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
// Dòng "const user = require("./models/user");" không cần thiết ở đây, bạn có thể xóa

const app = express();

// ✨ --- BẮT ĐẦU PHẦN SỬA LỖI CORS --- ✨
// Danh sách các "khách mời" được phép truy cập
const allowedOrigins = [
  "http://localhost:5173", // Cho phép frontend khi bạn phát triển ở máy
  "https://sdn-assignment4.vercel.app", // Cho phép frontend khi đã deploy lên Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép các request không có origin (như Postman hoặc mobile apps)
      if (!origin) return callback(null, true);

      // Nếu origin của request có trong danh sách khách mời, cho phép đi qua
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
// ✨ --- KẾT THÚC PHẦN SỬA LỖI CORS --- ✨

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Cấu hình Passport (quan trọng, bạn có thể đã thiếu phần này)
const passport = require("passport");
app.use(passport.initialize());

// Gắn các router
// ✨ Đổi thứ tự: users router nên có tiền tố /api/users để nhất quán
app.use("/api/quizzes", quizzesRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/users", usersRouter);

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
