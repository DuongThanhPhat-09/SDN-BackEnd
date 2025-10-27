const Quiz = require("../models/quiz");
const Question = require("../models/question");

// GET /quizzes (populate tất cả questions)
exports.list = async (_req, res, next) => {
  try {
    res.json(await Quiz.find().populate("questions"));
  } catch (e) {
    next(e);
  }
};

// GET /quizzes/:quizId
exports.getOne = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("questions");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (e) {
    next(e);
  }
};

// POST /quizzes
exports.create = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const quiz = await Quiz.create({ title, description });
    res.status(201).json(quiz);
  } catch (e) {
    next(e);
  }
};

// PUT /quizzes/:quizId
exports.update = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, {
      new: true,
    });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (e) {
    next(e);
  }
};

// DELETE /quizzes/:quizId (xoá cả questions thuộc quiz)
exports.remove = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    await Question.deleteMany({ _id: { $in: quiz.questions } });
    await quiz.deleteOne();
    res.json({ message: "Quiz deleted" });
  } catch (e) {
    next(e);
  }
};

// GET /quizzes/:quizId/populate?word=capital
exports.filterByWord = async (req, res, next) => {
  try {
    const word = (req.query.word || "capital").toString();
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: "questions",
      match: {
        $or: [
          { text: { $regex: word, $options: "i" } },
          { keywords: { $regex: word, $options: "i" } },
        ],
      },
    });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ quizId: quiz.id, word, matchedQuestions: quiz.questions });
  } catch (e) {
    next(e);
  }
};

// POST /quizzes/:quizId/question  (tạo 1 câu hỏi và gắn vào quiz)
exports.addOneQuestion = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    // ✨ SỬA LẠI DÒNG NÀY: Thêm "author: req.user._id"
    const q = await Question.create({
      ...req.body,
      quiz: quiz._id,
      author: req.user._id,
    });
    quiz.questions.push(q._id);
    await quiz.save();
    res.status(201).json(q);
  } catch (e) {
    next(e);
  }
};

// POST /quizzes/:quizId/questions (tạo nhiều câu hỏi)
exports.addManyQuestions = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    const payload = Array.isArray(req.body) ? req.body : [];
    const docs = await Question.insertMany(
      payload.map((x) => ({ ...x, quiz: quiz._id }))
    );
    quiz.questions.push(...docs.map((d) => d._id));
    await quiz.save();
    res.status(201).json(docs);
  } catch (e) {
    next(e);
  }
};
