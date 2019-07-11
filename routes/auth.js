const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/", (req, res, next) => {
  res.render("auth", { message: req.flash("error"), view: "login" });
});

router.get("/login", (req, res, next) => {
  res.render("auth", { message: req.flash("error"), view: "login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/auth",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth", { view: "signup" });
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === "" || password === "" || email === "") {
    res.render("auth", {
      message: "Please enter your username, password, and email.",
      view: "signup"
    });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth", {
        message: "The username already exists",
        view: "signup"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email: email
    });

    newUser
      .save()
      .then(() => {
        res.render("auth", {
          successMessage:
            "Account created! Please login with your credentials.",
          view: "login"
        });
      })
      .catch(err => {
        res.render("auth", { message: "Something went wrong", view: "signup" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth");
});

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
