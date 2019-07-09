const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Board = require("../models/Board");
const hbs = require("hbs");
const Util = require("../util/game-util");

hbs.registerHelper("json", data => JSON.stringify(data));
hbs.registerHelper("parse", data => JSON.parse(data));

/* GET home page */
router.get("/start-game", (req, res, next) => {
  let user = req.user;
  console.log(user);
  User.find({})
    .then(users => {
      console.log(users);
      res.render("boggle/settings", { user, users });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.post("/game", (req, res) => {
  let { dimension, generous, speed, currentUser, user2 } = req.body;
  generous = generous == "on";
  speed = speed == "on";
  let boardSize = dimension;
  User.findById(user2)
    .then(user => {
      let users = [req.user, user];
      Util.newGame(boardSize, users, generous, speed)
        .then(game => {
          Board.findById(game.board)
            .then(board => {
              let players = game.players;
              let id = game._id;
              res.render("boggle", { board, players, id });
            })
            .catch(err => {
              console.log("error loading board ", err);
            });
        })
        .catch(err => {
          console.log("error creating game ", err);
        });
    })
    .catch(err => {
      console.log("error finding user ", err);
    });
});

// axios.put("/game/:id", (req, res) => {
//   let words = req.words;
//   let seconds = req.seconds;
//   let userId = req.user._id;
//   console.log(words, seconds, userId);
//   // OpenGame.findByIdAndUpdate(req.params.id, ).then(game => {

//   // })
//   console.log(req);
// });

router.post("/game/:id", (req, res) => {
  console.log(req);
});

router.get("/game/:id", (req, res) => {
  console.log(req);
});

router.get("/games/user/:id", (req, res) => {});

module.exports = router;
