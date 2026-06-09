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
EXPORT
==================================================
*/

module.exports = router;
