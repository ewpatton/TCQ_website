const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  gameCode: String,
  questions: [String],
  times: [Number],
  points: [Number],
  questionPasswords: [String],
  adminPassword: String,
});

// compile model from schema
module.exports = mongoose.model("game", GameSchema);
