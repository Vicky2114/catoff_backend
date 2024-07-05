const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    score: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["lose", "won", "draw", "joined"], // Allow only these values
      //   required: true,
    },
    // Add more fields as needed
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
