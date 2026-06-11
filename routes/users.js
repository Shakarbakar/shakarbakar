/*
==================================================
USERS ROUTE
==================================================

Provides player directory data.

GET /api/users

==================================================
*/

const express = require("express");

const router = express.Router();

const User = require("../models/User");

/*
==================================================
GET ALL USERS
==================================================
*/

router.get("/", async (req, res) => {
  try {
    const users = await User.find({})
      .select("_id username bucksBalance createdAt")
      .sort({ username: 1 });

    res.json({
      success: true,
      users,
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
GET ARENA RANKINGS
==================================================

Returns top players ordered by arena score.

GET /api/users/rankings

==================================================
*/

router.get("/rankings", async (req, res) => {
  try {
    const users = await User.find({})
      .select("username duelWins duelLosses duelDraws arenaScore duelTrophies")
      .sort({
        arenaScore: -1,
        duelWins: -1,
      })
      .limit(10);

    res.json({
      success: true,
      rankings: users,
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
EXPORT
==================================================
*/

module.exports = router;
