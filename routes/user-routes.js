const express = require("express");
const User = require("../models/User");
const OpenGame = require("../models/OpenGame");
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
  OpenGame.find({ "players.displayName": req.user.username })
    .then(games => {
      console.log(games);
      User.find({})
        .then(users => {
          res.render("users/show", { user, users, games });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
