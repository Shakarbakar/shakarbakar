/*
==================================================
USER MODEL
==================================================
*/

const mongoose = require("mongoose");

/*
==================================================
USER SCHEMA
==================================================
*/

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  /*
  ==================================================
  STARTER BALANCE
  ==================================================
  */

  bucksBalance: {
    type: Number,
    default: 10000,
  },

  /*
  ==================================================
  ARENA STATS
  ==================================================
  */

  duelWins: {
    type: Number,
    default: 0,
  },

  duelLosses: {
    type: Number,
    default: 0,
  },

  duelDraws: {
    type: Number,
    default: 0,
  },

  arenaScore: {
    type: Number,
    default: 0,
  },

  duelTrophies: {
    type: Number,
    default: 0,
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
});

/*
==================================================
EXPORT MODEL
==================================================
*/

module.exports = mongoose.model("User", userSchema);
