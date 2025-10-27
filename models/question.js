const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    options: {
      type: [String],
      validate: (v) => Array.isArray(v) && v.length >= 2,
    },
    keywords: { type: [String], default: [] },
    correctAnswerIndex: {
      type: Number,
      required: true,
      validate: {
        validator: function (i) {
          return Number.isInteger(i) && i >= 0 && i < this.options.length;
        },
        message: "correctAnswerIndex out of range",
      },
    },
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },

    // ✨ THÊM TRƯỜNG NÀY VÀO
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // 'User' là tên model bạn export trong file user.js
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
