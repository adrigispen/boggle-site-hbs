const express = require("express");
const User = require("../models/User");
const OpenGame = require("../models/OpenGame");
const router = express.Router();
const Util = require("../util/game-util");

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
  Util.getProfileData(user)
    .then(data => {
      console.log(data);
      Util.getStats().then(promises => {
        Promise.all(promises)
          .then(usersData => {
            console.log(usersData);
            res.render("users/show", { user, data, usersData });
          })
          .catch(err => {
            console.log("promises won't resolve: ", err);
          });
      });
    })
    .catch(err => {
      console.log("couldn't get data from util method ", err);
    });
  // OpenGame.find({
  //   $and: [{ "players.displayName": req.user.username }, { winner: null }]
  // })
  //   .then(games => {
  //     console.log(games);
  //     User.find({})
  //       .then(users => {
  //         res.render("users/show", { user, users, games });
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
});

module.exports = router;
