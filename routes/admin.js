const express = require("express");

const router = express.Router();

const Announcement = require("../models/Announcement");

const User = require("../models/User");
const Team = require("../models/Team");
const Ownership = require("../models/Ownership");
const Friend = require("../models/Friend");
const FriendRequest = require("../models/FriendRequest");
const Duel = require("../models/Duel");
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");
const Tournament = require("../models/Tournament");

const EMPTY_TOURNAMENT_DATA = {
  upcomingMatches: [],
  results: [],
  qualifiedTeams: [],
  round16: [],
  quarterFinals: [],
  semiFinals: [],
  final: [],
};

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createItemId(prefix, existingId) {
  return cleanString(existingId) || `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeUpcomingMatches(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      id: createItemId("match", item.id),
      teamA: cleanString(item.teamA),
      teamB: cleanString(item.teamB),
      date: cleanString(item.date),
      time: cleanString(item.time),
      stadium: cleanString(item.stadium),
    }))
    .filter((item) => item.teamA && item.teamB);
}

function normalizeResults(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      id: createItemId("result", item.id),
      teamA: cleanString(item.teamA),
      teamB: cleanString(item.teamB),
      scoreA: Number(item.scoreA),
      scoreB: Number(item.scoreB),
    }))
    .filter(
      (item) =>
        item.teamA &&
        item.teamB &&
        Number.isFinite(item.scoreA) &&
        Number.isFinite(item.scoreB),
    );
}

function normalizeTeams(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...new Set(items.map(cleanString).filter(Boolean))];
}

function normalizeBracketMatches(items, prefix) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item, index) => ({
      id: createItemId(prefix, item.id),
      label: cleanString(item.label) || `Match ${index + 1}`,
      teamA: cleanString(item.teamA),
      teamB: cleanString(item.teamB),
    }))
    .filter((item) => item.teamA || item.teamB || item.label);
}

function normalizeTournamentPayload(payload = {}) {
  return {
    upcomingMatches: normalizeUpcomingMatches(payload.upcomingMatches),
    results: normalizeResults(payload.results),
    qualifiedTeams: normalizeTeams(payload.qualifiedTeams),
    round16: normalizeBracketMatches(payload.round16, "round16"),
    quarterFinals: normalizeBracketMatches(payload.quarterFinals, "qf"),
    semiFinals: normalizeBracketMatches(payload.semiFinals, "sf"),
    final: normalizeBracketMatches(payload.final, "final"),
  };
}

function serializeTournament(tournament) {
  return {
    upcomingMatches: tournament.upcomingMatches || [],
    results: tournament.results || [],
    qualifiedTeams: tournament.qualifiedTeams || [],
    round16: tournament.round16 || [],
    quarterFinals: tournament.quarterFinals || [],
    semiFinals: tournament.semiFinals || [],
    final: tournament.final || [],
    updatedAt: tournament.updatedAt,
  };
}

async function getTournamentDocument() {
  return Tournament.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: EMPTY_TOURNAMENT_DATA },
    { new: true, upsert: true },
  );
}

/*
==================================================
GET DASHBOARD STATS
==================================================
*/

router.get("/stats", async (req, res) => {
  try {
    const [
      users,
      teams,
      ownerships,
      friends,
      friendRequests,
      duels,
      messages,
      chatrooms,
      announcements,
    ] = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Ownership.countDocuments(),
      Friend.countDocuments(),
      FriendRequest.countDocuments(),
      Duel.countDocuments(),
      Message.countDocuments(),
      ChatRoom.countDocuments(),
      Announcement.countDocuments(),
    ]);

    res.json({
      success: true,

      stats: {
        users,
        teams,
        ownerships,
        friends,
        friendRequests,
        duels,
        messages,
        chatrooms,
        announcements,
      },
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
CREATE ANNOUNCEMENT
==================================================
*/

router.post("/announcement", async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.json({
        success: false,
        message: "Title and content are required",
      });
    }

    const announcement = await Announcement.create({
      title,
      content,
      category,
      createdBy: "JeddoElie",
    });

    res.json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
GET ALL ANNOUNCEMENTS
==================================================
*/

router.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
DELETE ANNOUNCEMENT
==================================================
*/

router.delete("/announcement/:id", async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
GET TOURNAMENT DATA
==================================================
*/

router.get("/tournament", async (req, res) => {
  try {
    const tournament = await getTournamentDocument();

    res.json({
      success: true,
      tournament: serializeTournament(tournament),
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
UPDATE TOURNAMENT DATA
==================================================
*/

router.put("/tournament", async (req, res) => {
  try {
    const tournamentData = normalizeTournamentPayload(req.body);
    const tournament = await getTournamentDocument();

    Object.assign(tournament, tournamentData);
    await tournament.save();

    res.json({
      success: true,
      tournament: serializeTournament(tournament),
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
