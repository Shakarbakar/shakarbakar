/*
==================================================
DUELS ROUTE
==================================================
*/

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Duel = require("../models/Duel");

/*
==================================================
CREATE DUEL
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

    const challenger = await User.findById(challengerUserId);

    const opponent = await User.findById(opponentUserId);

    if (!challenger || !opponent) {
      return res.json({
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

      status: "pending",
    });

    await duel.save();

    res.json({
      success: true,
      message: "Duel created",
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
ACCEPT DUEL
==================================================
*/

router.post("/accept", async (req, res) => {
  try {
    const { duelId, opponentPrediction } = req.body;

    const duel = await Duel.findById(duelId);

    if (!duel) {
      return res.json({
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
SUBMIT RESULT
==================================================
*/

router.post("/submit-result", async (req, res) => {
  try {
    const { duelId, actualResult } = req.body;

    const duel = await Duel.findById(duelId);

    if (!duel) {
      return res.json({
        success: false,
        message: "Duel not found",
      });
    }

    duel.submittedResult = actualResult;

    duel.resultSubmittedAt = new Date();

    duel.status = "awaiting_confirmation";

    await duel.save();

    res.json({
      success: true,
      message: "Result submitted",
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
CONFIRM RESULT
==================================================
*/

router.post("/confirm-result", async (req, res) => {
  try {
    const { duelId } = req.body;

    const duel = await Duel.findById(duelId);

    if (!duel) {
      return res.json({
        success: false,
        message: "Duel not found",
      });
    }

    const result = duel.submittedResult.toLowerCase().trim();

    const challengerPrediction = duel.challengerPrediction.toLowerCase().trim();

    const opponentPrediction = duel.opponentPrediction.toLowerCase().trim();

    let winner = null;
    let loser = null;

    if (challengerPrediction === result && opponentPrediction !== result) {
      winner = await User.findById(duel.challengerUserId);

      loser = await User.findById(duel.opponentUserId);
    }

    if (opponentPrediction === result && challengerPrediction !== result) {
      winner = await User.findById(duel.opponentUserId);

      loser = await User.findById(duel.challengerUserId);
    }

    /*
    ==================================================
    DRAW SYSTEM
    ==================================================
    */

    if (
      (challengerPrediction === result && opponentPrediction === result) ||
      (challengerPrediction !== result && opponentPrediction !== result)
    ) {
      const challenger = await User.findById(duel.challengerUserId);

      const opponent = await User.findById(duel.opponentUserId);

      if (challenger) {
        challenger.duelDraws = (challenger.duelDraws || 0) + 1;

        await challenger.save();
      }

      if (opponent) {
        opponent.duelDraws = (opponent.duelDraws || 0) + 1;

        await opponent.save();
      }
    }

    if (winner) {
      winner.duelWins = (winner.duelWins || 0) + 1;

      winner.arenaScore = (winner.arenaScore || 0) + 10;

      await winner.save();
    }

    if (loser) {
      loser.duelLosses = (loser.duelLosses || 0) + 1;

      await loser.save();
    }

    duel.resultConfirmed = true;

    duel.resultConfirmedAt = new Date();

    duel.status = "completed";

    duel.completedAt = new Date();

    if (winner) {
      duel.winnerUserId = winner._id;

      duel.winnerUsername = winner.username;
    }

    await duel.save();

    res.json({
      success: true,
      message: "Duel completed",
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
USER DUELS
==================================================
*/

router.get("/user/:userId", async (req, res) => {
  try {
    const duels = await Duel.find({
      $or: [
        {
          challengerUserId: req.params.userId,
        },
        {
          opponentUserId: req.params.userId,
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
PENDING DUELS
==================================================
*/

router.get("/pending/:userId", async (req, res) => {
  try {
    const duels = await Duel.find({
      opponentUserId: req.params.userId,
      status: "pending",
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
PENDING COUNT
==================================================
*/

router.get("/pending-count/:userId", async (req, res) => {
  try {
    const count = await Duel.countDocuments({
      opponentUserId: req.params.userId,
      status: "pending",
    });

    res.json({
      success: true,
      count,
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
ALL DUELS
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

module.exports = router;
