const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  players: [
    {
      user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      displayName: String,
      points: Number,
      words: [String],
      seconds: Number,
      color: String,
      currentPlayer: Boolean,
      finalScore: Number
    }
  ],
  board: { type: Schema.Types.ObjectId, required: true, ref: "Board" },
  winner: { type: Schema.Types.ObjectId, ref: "User" }
});

const OpenGame = mongoose.model("OpenGame", gameSchema);
module.exports = OpenGame;
