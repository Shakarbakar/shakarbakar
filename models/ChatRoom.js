/*
==================================================
CHAT ROOM MODEL
==================================================

Stores public chat rooms.

Used by:
- Arena Lobby
- Fan Club Chats
- User Created Rooms

==================================================
*/

const mongoose = require("mongoose");

/*
==================================================
CHAT ROOM SCHEMA
==================================================
*/

const chatRoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  description: {
    type: String,
    default: "",
  },

  createdByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdByUsername: {
    type: String,
    required: true,
  },

  roomType: {
    type: String,
    enum: ["public", "fanclub", "private"],
    default: "public",
  },

  membersCount: {
    type: Number,
    default: 1,
  },

  isActive: {
    type: Boolean,
    default: true,
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

chatRoomSchema.index({
  roomName: 1,
});

chatRoomSchema.index({
  roomType: 1,
});

chatRoomSchema.index({
  createdAt: -1,
});

/*
==================================================
EXPORT MODEL
==================================================
*/

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
