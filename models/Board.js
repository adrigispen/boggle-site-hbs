const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  //language: { type: String, enum: ["de", "en_US"], default: "en_US" },
  //size: {type: Number, enum: [3,4,5]}, << probably don't need this because I'll have the actual letters
  generous: { type: Boolean, default: false },
  shortTurns: { type: Boolean, default: true },
  letterMatrix: { type: [Array] }
});

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;
