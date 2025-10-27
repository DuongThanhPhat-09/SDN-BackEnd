const express = require("express");
const ctrl = require("../controllers/questions.controller");
const router = express.Router();
const authenticate = require("../authenticate"); // ✨ 1. Import file authenticate

// GET routes: Bất kỳ ai cũng có thể xem
router.get("/", ctrl.list);
router.get("/:questionId", ctrl.getOne);

// POST route: Bất kỳ người dùng nào đã đăng nhập đều có thể tạo
router.post("/", authenticate.verifyUser, ctrl.create);

// PUT và DELETE routes: Chỉ tác giả mới có quyền
router.put(
  "/:questionId",
  authenticate.verifyUser,
  authenticate.verifyAuthor,
  ctrl.update
);
router.delete(
  "/:questionId",
  authenticate.verifyUser,
  authenticate.verifyAuthor,
  ctrl.remove
);

module.exports = router;
