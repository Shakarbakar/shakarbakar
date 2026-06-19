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

module.exports = router;
