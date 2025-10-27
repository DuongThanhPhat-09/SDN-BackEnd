const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");
const userController = require("../controllers/users.controller");

// GET /users - Only Admins can view the user list
router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  async (req, res, next) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

// POST /signup - Handles new user registration
router.post("/signup", userController.signup);

// POST /login - Handles user login
// ✨ THE FIX IS ON THIS LINE
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  userController.login
);

module.exports = router;
