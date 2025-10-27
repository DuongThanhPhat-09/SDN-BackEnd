const express = require("express");
const ctrl = require("../controllers/quizzes.controller");
const router = express.Router();
const authenticate = require("../authenticate"); 

router.get("/", ctrl.list); 
router.get("/:quizId", ctrl.getOne); 

router.post(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  ctrl.create
);
router.put(
  "/:quizId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  ctrl.update
);
router.delete(
  "/:quizId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  ctrl.remove
);

// --- Extra Routes ---
router.get("/:quizId/populate", ctrl.filterByWord); // GET: Ai cũng có thể xem

// ✨ 3. Bảo vệ cả các route thay đổi dữ liệu khác
router.post(
  "/:quizId/question",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  ctrl.addOneQuestion
);
router.post(
  "/:quizId/questions",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  ctrl.addManyQuestions
);

module.exports = router;
