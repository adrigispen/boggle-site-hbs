const mongoose = require("mongoose");
const Player = require("../models/User");
//const OpenGame = require("../models/openGame");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const dbName = "boggle-site";
mongoose.connect(`mongodb://127.0.0.1/${dbName}`);

let players = [
  {
    username: "adri",
    password: bcrypt.hashSync("demo", bcrypt.genSaltSync(bcryptSalt)),
    email: "aegispen@gmail.com"
  },
  {
    username: "seed1",
    password: bcrypt.hashSync("seed1", bcrypt.genSaltSync(bcryptSalt)),
    email: "aegispen+seed1@gmail.com"
  },
  {
    username: "seed2",
    password: bcrypt.hashSync("seed2", bcrypt.genSaltSync(bcryptSalt)),
    email: "aegispen+seed2@gmail.com"
  }
];

Player.deleteMany()
  .then(() => {
    return Player.create(players);
  })
  .then(players => {
    console.log("Players successfully created! ", players);
  })
  .then(() => {
    mongoose.connection.close();
  })
  .catch(err => {
    mongoose.disconnect(),
      console.log("error encountered adding players: ", err);
  });
