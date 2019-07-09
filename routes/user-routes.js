const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/:id", (req, res, next) => {
  let id = req.params.id;
  User.findById(id)
    .then(user => {
      res.render("users/show", { user });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/", (req, res, next) => {
  let user = req.user;
  User.find({})
    .then(users => {
      res.render("users/show", { user, users });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
