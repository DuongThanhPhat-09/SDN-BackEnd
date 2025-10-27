const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const Question = require("./models/question");

require("dotenv").config();

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload._id });
      if (user) {
        return done(null, user); 
      } else {
        return done(null, false); 
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    next(); // Là admin, cho đi tiếp
  } else {
    const err = new Error("You are not authorized to perform this operation!");
    err.status = 403; // Forbidden
    return next(err);
  }
};

exports.verifyAuthor = async (req, res, next) => {
  try {
    const questionId = req.params.questionId;
    const question = await Question.findById(questionId);

    if (!question) {
      /* ... */
    }

    console.log("--- DEBUGGING verifyAuthor ---");
    if (!question.author) {
      console.log("!!! This question has NO author field!");
    } else {
      console.log("Question's Author ID:", question.author.toString());
    }
    console.log("Logged-in User ID: ", req.user._id.toString());
    console.log(
      "Are they equal?    ",
      question.author ? question.author.equals(req.user._id) : false
    );
    console.log("----------------------------");

    if (question.author && req.user && question.author.equals(req.user._id)) {
      next();
    } else {
      const err = new Error("You are not the author of this question");
      err.status = 403;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
