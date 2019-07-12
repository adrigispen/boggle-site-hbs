const express = require("express");
const User = require("../models/User");
const OpenGame = require("../models/OpenGame");
const router = express.Router();
const Util = require("../util/game-util");
const nodemailer = require("nodemailer");

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
  Util.getProfileData(user).then(data => {
    let myTurn = data.open.filter(
      game => game.currentPlayer._id.toString() == user._id.toString()
    );
    let othersTurn = data.open.filter(
      game => game.currentPlayer._id.toString() != user._id.toString()
    );
    res.render("users/show", {
      user,
      data,
      myTurn,
      othersTurn
    });
  });
});

router.post("/send-email/:id", (req, res, next) => {
  let { cp } = req.body;
  let user = req.user;
  let subject = "It's your turn!";
  let href = `${process.env.HOST_NAME}/auth`;
  let message = `Hi ${cp.username}, ${
    user.username
  } has started a game of Boggle with you. It's your turn to play! <a href="${href}">Click here</a> to log in and take your turn.`;
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "bogglebot123@gmail.com",
      pass: "gameironhack1!"
    }
  });
  transporter
    .sendMail({
      from: `"${user.username}" <${user.username}@bogglebot.com>`,
      to: cp.email,
      subject: subject,
      text: message,
      html: `<b>${message}</b>`
    })
    .then(response => {
      console.log("here, sent a mail maybe?");
      console.log(response);
      res.status(200).json({ response });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
