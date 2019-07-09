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
      currentPlayer: Boolean
    }
  ],
  board: { type: Schema.Types.ObjectId, required: true, ref: "Board" }
  // maybe need a state to store current player & winner, is finished, etc.
});

const OpenGame = mongoose.model("OpenGame", gameSchema);
module.exports = OpenGame;
