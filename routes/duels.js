/*
==================================================
DUELS ROUTE
==================================================

Handles:

- Create Duel
- Accept Duel
- List Duels
- Duel History

==================================================
*/

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Duel = require("../models/Duel");

/*
==================================================
POST /api/duels/create
==================================================
*/

router.post("/create", async (req, res) => {
  try {
    const {
      challengerUserId,
      opponentUserId,
      duelTitle,
      duelQuestion,
      challengerPrediction,
    } = req.body;

    if (
      !challengerUserId ||
      !opponentUserId ||
      !duelTitle ||
      !duelQuestion ||
      !challengerPrediction
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing duel information",
      });
    }

    const challenger = await User.findById(challengerUserId);

    const opponent = await User.findOne({
      username: opponentUserId,
    });

    if (!challenger || !opponent) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const duel = new Duel({
      challengerUserId: challenger._id,

      challengerUsername: challenger.username,

      opponentUserId: opponent._id,

      opponentUsername: opponent.username,

      duelTitle,
      duelQuestion,
      challengerPrediction,
    });

    await duel.save();

    res.json({
      success: true,
      message: "Duel created",
      duel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
POST /api/duels/accept
==================================================
*/

router.post("/accept", async (req, res) => {
  try {
    const { duelId, opponentPrediction } = req.body;

    const duel = await Duel.findById(duelId);

    if (!duel) {
      return res.status(404).json({
        success: false,
        message: "Duel not found",
      });
    }

    duel.opponentPrediction = opponentPrediction;

    duel.status = "accepted";

    await duel.save();

    res.json({
      success: true,
      message: "Duel accepted",
      duel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
GET /api/duels/user/:userId
==================================================
*/

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const duels = await Duel.find({
      $or: [
        {
          challengerUserId: userId,
        },

        {
          opponentUserId: userId,
        },
      ],
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      duels,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
GET /api/duels/pending/:userId
==================================================
*/

router.get("/pending/:userId", async (req, res) => {
  try {
    const duels = await Duel.find({
      opponentUserId: req.params.userId,

      status: "pending",
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      duels,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
POST /api/duels/complete
==================================================
*/

router.post("/complete", async (req, res) => {
  try {
    const { duelId, correctAnswer, winnerUserId } = req.body;

    const duel = await Duel.findById(duelId);

    if (!duel) {
      return res.status(404).json({
        success: false,
        message: "Duel not found",
      });
    }

    duel.correctAnswer = correctAnswer;

    duel.winnerUserId = winnerUserId;

    const winner = await User.findById(winnerUserId);

    if (winner) {
      duel.winnerUsername = winner.username;
    }

    duel.status = "completed";

    duel.completedAt = new Date();

    await duel.save();

    res.json({
      success: true,
      message: "Duel completed",

      duel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
GET /api/duels/all
==================================================
*/

router.get("/all", async (req, res) => {
  try {
    const duels = await Duel.find({}).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      duels,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
EXPORT ROUTE
==================================================
*/

module.exports = router;
