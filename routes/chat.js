/*
==================================================
CHAT ROUTE
==================================================

Handles:

- Player Directory
- Friend Requests
- Private Messages
- Arena Lobby
- Chat Rooms

==================================================
*/

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Message = require("../models/Message");
const FriendRequest = require("../models/FriendRequest");
const ChatRoom = require("../models/ChatRoom");

/*
==================================================
GET /api/chat/users
==================================================

Returns all users.

==================================================
*/

router.get("/users", async (req, res) => {
  try {
    const users = await User.find(
      {},
      {
        password: 0,
      },
    ).sort({
      username: 1,
    });

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
POST /api/chat/friend-request
==================================================
*/

router.post("/friend-request", async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    if (!fromUserId || !toUserId) {
      return res.status(400).json({
        success: false,
        message: "Missing user information",
      });
    }

    const sender = await User.findById(fromUserId);
    const receiver = await User.findById(toUserId);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      fromUserId,
      toUserId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request already sent",
      });
    }

    const request = new FriendRequest({
      fromUserId,
      fromUsername: sender.username,

      toUserId,
      toUsername: receiver.username,
    });

    await request.save();

    res.json({
      success: true,
      message: "Friend request sent",
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
GET /api/chat/friend-requests/:userId
==================================================
*/

router.get("/friend-requests/:userId", async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      toUserId: req.params.userId,
      status: "pending",
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      requests,
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
POST /api/chat/send-message
==================================================
*/

router.post("/send-message", async (req, res) => {
  try {
    const { fromUserId, toUserId, message } = req.body;

    const sender = await User.findById(fromUserId);

    const receiver = await User.findById(toUserId);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newMessage = new Message({
      fromUserId,
      fromUsername: sender.username,

      toUserId,
      toUsername: receiver.username,

      message,
    });

    await newMessage.save();

    res.json({
      success: true,
      message: "Message sent",
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
GET /api/chat/messages
==================================================

Query:

?user1=
&user2=

==================================================
*/

router.get("/messages", async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    const messages = await Message.find({
      $or: [
        {
          fromUserId: user1,
          toUserId: user2,
        },

        {
          fromUserId: user2,
          toUserId: user1,
        },
      ],
    }).sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      messages,
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
GET /api/chat/rooms
==================================================
*/

router.get("/rooms", async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      isActive: true,
    }).sort({
      roomName: 1,
    });

    res.json({
      success: true,
      rooms,
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
POST /api/chat/create-room
==================================================
*/

router.post("/create-room", async (req, res) => {
  try {
    const { roomName, description, userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const room = new ChatRoom({
      roomName,
      description,

      createdByUserId: user._id,
      createdByUsername: user.username,
    });

    await room.save();

    res.json({
      success: true,
      room,
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
