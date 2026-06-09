/*
==================================================
DUEL MODEL
==================================================

Stores Prediction Duels between players.

Used by:
- Create Duel
- Accept Duel
- Duel History
- Duel Results

==================================================
*/

const mongoose = require("mongoose");

/*
==================================================
DUEL SCHEMA
==================================================
*/

const duelSchema = new mongoose.Schema({
  challengerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  challengerUsername: {
    type: String,
    required: true,
  },

  opponentUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  opponentUsername: {
    type: String,
    required: true,
  },

  duelTitle: {
    type: String,
    required: true,
  },

  duelQuestion: {
    type: String,
    required: true,
  },

  challengerPrediction: {
    type: String,
    required: true,
  },

  opponentPrediction: {
    type: String,
    default: "",
  },

  correctAnswer: {
    type: String,
    default: "",
  },

  winnerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  winnerUsername: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "cancelled"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  completedAt: {
    type: Date,
    default: null,
  },
});

/*
==================================================
INDEXES
==================================================
*/

duelSchema.index({
  challengerUserId: 1,
});

duelSchema.index({
  opponentUserId: 1,
});

duelSchema.index({
  status: 1,
});

duelSchema.index({
  createdAt: -1,
});

/*
==================================================
EXPORT MODEL
==================================================
*/

module.exports = mongoose.model("Duel", duelSchema);
