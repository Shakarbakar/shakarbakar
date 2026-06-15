/*
==================================================
CHAT ROUTE
==================================================

Handles:

- Player Directory
- Friend Requests
- Friends List
- Private Messages
- Arena Lobby
- Chat Rooms

==================================================
*/

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../models/User");
const Message = require("../models/Message");
const FriendRequest = require("../models/FriendRequest");
const Friend = require("../models/Friend");
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

Creates a new friend request.

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

    /*
    ==========================================
    PREVENT SELF REQUESTS
    ==========================================
    */

    if (String(fromUserId) === String(toUserId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself",
      });
    }

    /*
    ==========================================
    CHECK EXISTING FRIENDSHIP
    ==========================================
    */

    const existingFriend = await Friend.findOne({
      userId: fromUserId,
      friendUserId: toUserId,
    });

    if (existingFriend) {
      return res.status(400).json({
        success: false,
        message: "Already friends",
      });
    }

    /*
    ==========================================
    CHECK EXISTING REQUEST
    ==========================================
    */

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

Returns all pending requests.

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
POST /api/chat/friend-request/accept
==================================================

Accepts a friend request.

Creates TWO friendship records:

John -> Maria
Maria -> John

==================================================
*/

router.post("/friend-request/accept", async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    /*
    ==========================================
    UPDATE REQUEST STATUS
    ==========================================
    */

    request.status = "accepted";

    await request.save();

    /*
    ==========================================
    CREATE FRIENDSHIP RECORD A
    ==========================================
    */

    await Friend.create({
      userId: request.fromUserId,
      username: request.fromUsername,

      friendUserId: request.toUserId,
      friendUsername: request.toUsername,
    });

    /*
    ==========================================
    CREATE FRIENDSHIP RECORD B
    ==========================================
    */

    await Friend.create({
      userId: request.toUserId,
      username: request.toUsername,

      friendUserId: request.fromUserId,
      friendUsername: request.fromUsername,
    });

    res.json({
      success: true,
      message: "Friend request accepted",
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
POST /api/chat/friend-request/reject
==================================================

Rejects a friend request.

==================================================
*/

router.post("/friend-request/reject", async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    request.status = "rejected";

    await request.save();

    res.json({
      success: true,
      message: "Friend request rejected",
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
GET /api/chat/friends/:userId
==================================================

Returns all friends for a user.

==================================================
*/

router.get("/friends/:userId", async (req, res) => {
  try {
    const friends = await Friend.find({
      userId: req.params.userId,
    }).sort({
      friendUsername: 1,
    });

    res.json({
      success: true,
      friends,
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
POST /api/chat/remove-friend
==================================================

Removes friendship in BOTH directions.

==================================================
*/

router.post("/remove-friend", async (req, res) => {
  try {
    const { userId, friendUserId } = req.body;

    await Friend.deleteOne({
      userId,
      friendUserId,
    });

    await Friend.deleteOne({
      userId: friendUserId,
      friendUserId: userId,
    });

    res.json({
      success: true,
      message: "Friend removed",
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

    if (
      !mongoose.isValidObjectId(fromUserId) ||
      !mongoose.isValidObjectId(toUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid sender and recipient are required",
      });
    }

    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (!trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    if (String(fromUserId) === String(toUserId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot message yourself",
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

    const friendship = await Friend.findOne({
      userId: fromUserId,
      friendUserId: toUserId,
    });

    if (!friendship) {
      return res.status(403).json({
        success: false,
        message: "You can only message approved friends",
      });
    }

    const newMessage = new Message({
      fromUserId,
      fromUsername: sender.username,

      toUserId,
      toUsername: receiver.username,

      message: trimmedMessage,
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
*/

router.get("/messages", async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    if (
      !mongoose.isValidObjectId(user1) ||
      !mongoose.isValidObjectId(user2)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid conversation participants are required",
      });
    }

    const friendship = await Friend.findOne({
      userId: user1,
      friendUserId: user2,
    });

    if (!friendship) {
      return res.status(403).json({
        success: false,
        message: "You can only view conversations with approved friends",
      });
    }

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
