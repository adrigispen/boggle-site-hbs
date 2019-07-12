const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Board = require("../models/Board");
const OpenGame = require("../models/OpenGame");
const hbs = require("hbs");
const Util = require("../util/game-util");

hbs.registerHelper("json", data => JSON.stringify(data));
//hbs.registerHelper("parse", data => JSON.parse(data));

router.get("/", (req, res, next) => {
  res.redirect("/auth");
});

router.get("/start-game", (req, res, next) => {
  let user = req.user;
  User.find({})
    .then(users => {
      let usersUnique = users.filter(u => user.username != u.username);
      res.render("boggle/settings", { user, usersUnique });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.post("/start-game", (req, res) => {
  let tempname = req.body.tempname;
  console.log(tempname);
  res.render("boggle/settings", { tempname });
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
  OpenGame.findById(req.params.id)
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
      console.log(err);
    });
});

router.post("/save-game/:id", (req, res, next) => {
  OpenGame.findOneAndUpdate(
    { _id: req.params.id, "players._id": req.body.playerId },
    {
      $set: {
        "players.$.words": req.body.newWords,
        "players.$.seconds": req.body.seconds,
        "players.$.points": req.body.points,
        "players.$.currentPlayer": false,
        "players.$.turnOver": true
      }
    }
  )
    .then(game => {
      console.log("successfully updated");
      res.status(200).json({ game });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/set-player/:id", (req, res) => {
  OpenGame.findOneAndUpdate(
    { _id: req.params.id, "players._id": req.body.playerId },
    {
      $set: {
        "players.$.currentPlayer": true
      },
      currentPlayer: req.body.userId
    }
  )
    .then(game => {
      console.log("successfully set the current player");
      res.status(200).json({ game });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/end-game/:id", (req, res, next) => {
  let winner = req.body.winner;
  User.findOne({ username: winner.name }).then(winner => {
    OpenGame.findOneAndUpdate(
      { _id: req.params.id },
      {
        winner: winner._id
      }
    )
      .then(game => {
        console.log("successfully stored winner");
        console.log(game);
        res.status(200).json({ game });
      })
      .catch(err => {
        console.log(err);
      });
  });
});

router.get("/leaderboard", (req, res) => {
  let user = req.user;
  Util.getStats()
    .then(promises => {
      Promise.all(promises)
        .then(usersData => {
          usersData.map(userData => {
            userData.totalClosed.map(game => {
              game.players.map(
                player =>
                  (player.finalScore =
                    player.seconds == 0
                      ? 0
                      : ((player.points / player.seconds) * 100).toFixed(2))
              );
            });
          });
          usersData.sort((a, b) => b.wonCount - a.wonCount);
          res.render("boggle/leaderboard", { usersData, user });
        })
        .catch(err => {
          console.log("promises won't resolve: ", err);
        });
    })
    .catch(err => {
      console.log("can't get stats from util method: ", err);
    });
});

module.exports = router;
