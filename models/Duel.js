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
- Arena Rankings

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

  /*
  ==================================================
  RESULT SYSTEM
  ==================================================
  */

  submittedResult: {
    type: String,
    default: "",
  },

  resultSubmittedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  resultSubmittedByUsername: {
    type: String,
    default: "",
  },

  resultSubmittedAt: {
    type: Date,
    default: null,
  },

  /*
  ==================================================
  CONFIRMATION SYSTEM
  ==================================================
  */

  resultConfirmed: {
    type: Boolean,
    default: false,
  },

  resultConfirmedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  resultConfirmedAt: {
    type: Date,
    default: null,
  },

  /*
  ==================================================
  DISPUTE SYSTEM
  ==================================================
  */

  disputed: {
    type: Boolean,
    default: false,
  },

  disputedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  disputedAt: {
    type: Date,
    default: null,
  },

  /*
  ==================================================
  FINAL RESULT
  ==================================================
  */

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

  /*
  ==================================================
  STATUS
  ==================================================
  */

  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "awaiting_result",
      "awaiting_confirmation",
      "completed",
      "cancelled",
      "disputed",
    ],
    default: "pending",
  },

  /*
  ==================================================
  DATES
  ==================================================
  */

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
