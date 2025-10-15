const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

router.post("/register", authController.registerUser);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: info.message || "invalid credentials." });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      authController.loginSuccess(req, res);
    });
  })(req, res, next);
});

router.post("/logout", authController.logoutUser);

router.get("/loginSuccess", authController.loginSuccess);

module.exports = router;
