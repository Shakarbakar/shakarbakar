/*
==================================================
FRIEND REQUEST MODEL
==================================================

Stores friend requests between users.

Used by:
- Add Friend
- Accept Friend Request
- Reject Friend Request

==================================================
*/

const mongoose = require("mongoose");

/*
==================================================
FRIEND REQUEST SCHEMA
==================================================
*/

const friendRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  fromUsername: {
    type: String,
    required: true,
  },

  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  toUsername: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/*
==================================================
INDEXES
==================================================
*/

friendRequestSchema.index({
  fromUserId: 1,
  toUserId: 1,
});

friendRequestSchema.index({
  toUserId: 1,
  status: 1,
});

friendRequestSchema.index({
  createdAt: -1,
});

/*
==================================================
EXPORT MODEL
==================================================
*/

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
