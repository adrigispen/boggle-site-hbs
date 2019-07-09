const Board = require("../models/Board");
const OpenGame = require("../models/OpenGame");
const User = require("../models/User");

function newBoard(boardSize, generous, shortTurns) {
  let letterMatrix = [];
  for (var i = 0; i < boardSize; i++) {
    letterMatrix[i] = [];
    for (var j = 0; j < boardSize; j++) {
      letterMatrix[i].push(getRandomLetter().toUpperCase());
    }
  }
  console.log(letterMatrix);
  return Board.create({ generous, shortTurns, letterMatrix })
    .then(board => {
      return board;
    })
    .catch(err => {
      console.log(err);
    });
}

function getRandomLetter() {
  return en_US[Math.floor(Math.random() * en_US.length)];
}

function newGame(boardSize, users, generous, shortTurns) {
  return newBoard(boardSize, generous, shortTurns)
    .then(boardFull => {
      let board = boardFull._id;
      let players = users.map(u => ({
        user: u._id,
        displayName: u.username,
        points: 0,
        words: [],
        color: getRandomColor(),
        seconds: 0,
        currentPlayer: false
      }));
      return OpenGame.create({ players, board })
        .then(game => {
          console.log(game);
          return game;
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log("error getting board", err);
    });
}

const en_US = [
  "a",
  "a",
  "a",
  "a",
  "a",
  "a",
  "a",
  "a",
  "a",
  "a",
  "b",
  "b",
  "b",
  "c",
  "c",
  "c",
  "d",
  "d",
  "d",
  "d",
  "d",
  "e",
  "e",
  "e",
  "e",
  "e",
  "e",
  "e",
  "e",
  "e",
  "e",
  "e",
  "e",
  "e",
  "f",
  "f",
  "f",
  "g",
  "g",
  "g",
  "g",
  "h",
  "h",
  "h",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "j",
  "k",
  "l",
  "l",
  "l",
  "l",
  "l",
  "m",
  "m",
  "m",
  "n",
  "n",
  "n",
  "n",
  "n",
  "n",
  "n",
  "o",
  "o",
  "o",
  "o",
  "o",
  "o",
  "o",
  "o",
  "o",
  "o",
  "p",
  "p",
  "p",
  "q",
  "r",
  "r",
  "r",
  "r",
  "r",
  "r",
  "r",
  "s",
  "s",
  "s",
  "s",
  "s",
  "t",
  "t",
  "t",
  "t",
  "t",
  "t",
  "t",
  "u",
  "u",
  "u",
  "u",
  "u",
  "v",
  "v",
  "v",
  "w",
  "w",
  "w",
  "x",
  "y",
  "y",
  "y",
  "z"
];

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = { newBoard, newGame };
