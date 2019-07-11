const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    players: [
      {
        user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        displayName: String,
        points: Number,
        words: [String],
        seconds: Number,
        color: String,
        currentPlayer: Boolean,
        finalScore: Number,
        turnOver: Boolean
      }
    ],
    board: { type: Schema.Types.ObjectId, required: true, ref: "Board" },
    winner: { type: Schema.Types.ObjectId, ref: "User" },
    currentPlayer: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const OpenGame = mongoose.model("OpenGame", gameSchema);
module.exports = OpenGame;
