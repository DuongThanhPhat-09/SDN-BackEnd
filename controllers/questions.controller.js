const Question = require("../models/question");
const Quiz = require("../models/quiz");

// GET /questions - Lấy tất cả câu hỏi, kèm thông tin tác giả
exports.list = async (_req, res, next) => {
  try {
    res.json(await Question.find({}).populate("author"));
  } catch (e) {
    next(e);
  }
};

// GET /questions/:questionId - Lấy một câu hỏi, kèm thông tin tác giả
exports.getOne = async (req, res, next) => {
  try {
    const q = await Question.findById(req.params.questionId).populate("author");
    if (!q) return res.status(404).json({ message: "Question not found" });
    res.json(q);
  } catch (e) {
    next(e);
  }
};

// POST /questions - Tạo câu hỏi mới và gán tác giả
exports.create = async (req, res, next) => {
  try {
    const newQuestionData = req.body;

    // Gán ID của người dùng đã đăng nhập vào trường author
    newQuestionData.author = req.user._id;

    // ✨ CÁC DÒNG BỊ THIẾU TRƯỚC ĐÂY
    // Tạo câu hỏi trong database
    const q = await Question.create(newQuestionData);

    // Nếu có gửi kèm quizId, cập nhật lại quiz đó
    if (q.quiz) {
      await Quiz.findByIdAndUpdate(q.quiz, { $addToSet: { questions: q._id } });
    }

    // Trả về câu hỏi vừa tạo thành công
    res.status(201).json(q);
  } catch (e) {
    console.error("!!! ERROR during create:", e);
    next(e);
  }
};

// PUT /questions/:questionId - Cập nhật câu hỏi
exports.update = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    Object.assign(question, req.body);
    const updatedQuestion = await question.save();

    res.json(updatedQuestion);
  } catch (e) {
    console.error("!!! ERROR during update:", e);
    next(e);
  }
};

// DELETE /questions/:questionId - Xóa câu hỏi
exports.remove = async (req, res, next) => {
  try {
    const q = await Question.findByIdAndDelete(req.params.questionId);
    if (!q) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (q.quiz) {
      await Quiz.findByIdAndUpdate(q.quiz, { $pull: { questions: q._id } });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (e) {
    console.error("!!! ERROR during delete:", e);
    next(e);
  }
};
