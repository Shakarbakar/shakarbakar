/*
==================================================
OWNERSHIP ROUTE
==================================================

Handles team ownership (buying teams).

POST /api/ownership/buy
    Buy a team for the logged-in user.

GET /api/ownership?userId=
    List all teams owned by a user.

==================================================
*/

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../models/User");
const Team = require("../models/Team");
const Ownership = require("../models/Ownership");
const Friend = require("../models/Friend");

function formatOwnership(ownership) {
  return {
    id: ownership._id,
    userId: ownership.userId,
    username: ownership.username,
    teamId: ownership.teamId,
    teamName: ownership.teamName,
    purchasePrice: ownership.purchasePrice,
    purchaseDate: ownership.purchaseDate,
    ownershipMessage: "I own " + ownership.teamName,
  };
}

function buildPortfolioSummary(ownerships) {
  return {
    totalTeams: ownerships.length,
    totalInvested: ownerships.reduce(
      (total, ownership) => total + (ownership.purchasePrice || 0),
      0,
    ),
    portfolioValue: null,
    teamRanking: null,
    ownershipHistoryReady: true,
  };
}

/*
==================================================
POST /api/ownership/buy
==================================================

Body:
{
    userId: "mongodb user id",
    teamId: "mongodb team id"
}

==================================================
*/

router.post("/buy", async (req, res) => {
  try {
    const { userId, teamId } = req.body;

    /*
        ==========================================
        VALIDATION
        ==========================================
        */

    if (!userId || !teamId) {
      return res.status(400).json({
        success: false,
        message: "You must be logged in to buy a team",
      });
    }

    /*
        ==========================================
        LOAD USER
        ==========================================
        */

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to buy a team",
      });
    }

    /*
        ==========================================
        LOAD TEAM
        ==========================================
        */

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    /*
        ==========================================
        CHECK DUPLICATE OWNERSHIP
        ==========================================

        A user may not buy the same team twice.

        */

    const existingOwnership = await Ownership.findOne({
      userId: user._id,
      teamId: team._id,
    });

    if (existingOwnership) {
      return res.status(400).json({
        success: false,
        message: "I own " + team.name,
      });
    }

    /*
        ==========================================
        CHECK BUCKS BALANCE
        ==========================================
        */

    if (user.bucksBalance < team.price) {
      return res.status(400).json({
        success: false,
        message:
          "Not enough Bucks. You need " +
          team.price.toLocaleString() +
          " Bucks.",
      });
    }

    /*
        ==========================================
        DEDUCT BUCKS AND CREATE OWNERSHIP
        ==========================================
        */

    user.bucksBalance = user.bucksBalance - team.price;

    await user.save();

    const ownership = new Ownership({
      userId: user._id,
      username: user.username,
      teamId: team._id,
      teamName: team.name,
      purchasePrice: team.price,
    });

    await ownership.save();

    /*
        ==========================================
        SUCCESS RESPONSE
        ==========================================

        Uses ShakarBakar language:
        "I own [Team Name]"

        */

    res.json({
      success: true,
      message: "You now own " + team.name + ".",

      ownershipMessage: "I own " + team.name,

      remainingBalance: user.bucksBalance,

      user: {
        id: user._id,
        username: user.username,
        bucksBalance: user.bucksBalance,
      },

      team: {
        id: team._id,
        name: team.name,
        flag: team.flag,
      },
    });
  } catch (error) {
    console.error(error);

    // Duplicate key from unique index
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already own this team",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/*
==================================================
GET /api/ownership
==================================================

Returns all teams owned by a user.

==================================================
*/

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const ownerships = await Ownership.find({
      userId: userId,
    }).sort({ purchaseDate: -1 });

    res.json({
      success: true,

      ownerships: ownerships.map((o) => ({
        teamId: o.teamId,
        teamName: o.teamName,
        purchasePrice: o.purchasePrice,
        purchaseDate: o.purchaseDate,
        ownershipMessage: "I own " + o.teamName,
      })),
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
GET /api/ownership/user/:userId
==================================================
*/

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid userId is required",
      });
    }

    const user = await User.findById(userId).select(
      "_id username bucksBalance duelWins createdAt",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [ownerships, friendsCount] = await Promise.all([
      Ownership.find({
        userId,
      }).sort({
        purchaseDate: -1,
      }),
      Friend.countDocuments({
        userId,
      }),
    ]);

    const formattedOwnerships = ownerships.map(formatOwnership);

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        bucksBalance: user.bucksBalance,
        duelWins: user.duelWins || 0,
        createdAt: user.createdAt,
        friendsCount,
      },
      ownerships: formattedOwnerships,
      summary: buildPortfolioSummary(formattedOwnerships),
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
GET /api/ownership/summaries?userIds=
==================================================
*/

router.get("/summaries", async (req, res) => {
  try {
    const userIds = String(req.query.userIds || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const validUserIds = userIds.filter((id) => mongoose.isValidObjectId(id));

    if (validUserIds.length === 0) {
      return res.json({
        success: true,
        summaries: {},
      });
    }

    const ownerships = await Ownership.find({
      userId: {
        $in: validUserIds,
      },
    }).sort({
      purchaseDate: -1,
    });

    const summaries = {};

    validUserIds.forEach((userId) => {
      summaries[userId] = {
        totalTeams: 0,
        totalInvested: 0,
        teams: [],
        previewTeams: [],
        moreCount: 0,
        portfolioValue: null,
      };
    });

    ownerships.forEach((ownership) => {
      const userId = String(ownership.userId);
      const summary = summaries[userId];

      if (!summary) {
        return;
      }

      const team = formatOwnership(ownership);

      summary.totalTeams += 1;
      summary.totalInvested += ownership.purchasePrice || 0;
      summary.teams.push(team);
    });

    Object.values(summaries).forEach((summary) => {
      summary.previewTeams = summary.teams.slice(0, 3);
      summary.moreCount = Math.max(summary.totalTeams - 3, 0);
    });

    res.json({
      success: true,
      summaries,
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
GET /api/ownership/team/:teamId/owners
==================================================
*/

router.get("/team/:teamId/owners", async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!mongoose.isValidObjectId(teamId)) {
      return res.status(400).json({
        success: false,
        message: "Valid teamId is required",
      });
    }

    const [team, ownerships] = await Promise.all([
      Team.findById(teamId),
      Ownership.find({
        teamId,
      }).sort({
        purchaseDate: -1,
      }),
    ]);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.json({
      success: true,
      team: {
        id: team._id,
        name: team.name,
        flag: team.flag,
        currentPrice: team.price,
      },
      owners: ownerships.map(formatOwnership),
      futureReady: {
        richestCollectors: null,
        mostTeamsOwned: null,
        ownershipHistory: [],
      },
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
POST /api/ownership/sell
==================================================
*/

router.post("/sell", async (req, res) => {
  try {
    const { userId, teamId } = req.body;

    const ownership = await Ownership.findOne({
      userId,
      teamId,
    });

    if (!ownership) {
      return res.status(404).json({
        success: false,
        message: "Ownership not found",
      });
    }

    const user = await User.findById(userId);

    const team = await Team.findById(teamId);

    if (!user || !team) {
      return res.status(404).json({
        success: false,
        message: "User or team not found",
      });
    }

    user.bucksBalance += team.price;

    await user.save();

    await Ownership.deleteOne({
      _id: ownership._id,
    });

    res.json({
      success: true,

      message:
        "You sold " +
        team.name +
        " for " +
        team.price.toLocaleString() +
        " Bucks.",

      newBalance: user.bucksBalance,
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
