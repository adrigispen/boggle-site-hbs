const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    openGames: [{ type: Schema.Types.ObjectId, ref: "OpenGame" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    email: { type: String },
    username: { type: String },
    password: { type: String },
    facebookId: String
    //maybe a photo upload if I get to it
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
