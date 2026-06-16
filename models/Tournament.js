const mongoose = require("mongoose");

const upcomingMatchSchema = new mongoose.Schema(
  {
    id: String,
    teamA: String,
    teamB: String,
    date: String,
    time: String,
    stadium: String,
  },
  { _id: false },
);

const resultSchema = new mongoose.Schema(
  {
    id: String,
    teamA: String,
    teamB: String,
    scoreA: Number,
    scoreB: Number,
  },
  { _id: false },
);

const bracketMatchSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    teamA: String,
    teamB: String,
  },
  { _id: false },
);

const tournamentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
    },
    upcomingMatches: [upcomingMatchSchema],
    results: [resultSchema],
    qualifiedTeams: [String],
    round16: [bracketMatchSchema],
    quarterFinals: [bracketMatchSchema],
    semiFinals: [bracketMatchSchema],
    final: [bracketMatchSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Tournament", tournamentSchema);
