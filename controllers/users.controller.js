const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");

exports.signup = (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    async (err, user) => {
      // "user" là đối tượng chúng ta cần
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.json({ err: err });
      }

      if (req.body.admin) {
        user.admin = req.body.admin;
      }

      try {
        await user.save();

        passport.authenticate("local")(req, res, () => {
          // ✨ THAY ĐỔI Ở ĐÂY: Dùng "user._id" thay vì "req.user._id"
          const token = authenticate.getToken({ _id: user._id });

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: true,
            token: token,
            status: "Registration Successful!",
          });
        });
      } catch (saveErr) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.json({ err: saveErr });
      }
    }
  );
};

exports.login = (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  // ✨ Thêm "user: req.user" vào response
  res.json({
    success: true,
    token: token,
    user: req.user,
    status: "You are successfully logged in!",
  });
};
