/*
==================================================
MESSAGE MODEL
==================================================

Stores private messages between users.

Used by:
- Private Messages
- Friends Chat
- Inbox

==================================================
*/

const mongoose = require("mongoose");

/*
==================================================
MESSAGE SCHEMA
==================================================
*/

const messageSchema = new mongoose.Schema({
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

  message: {
    type: String,
    required: true,
    trim: true,
  },

  isRead: {
    type: Boolean,
    default: false,
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

messageSchema.index({
  fromUserId: 1,
  toUserId: 1,
});

messageSchema.index({
  toUserId: 1,
  isRead: 1,
});

messageSchema.index({
  createdAt: -1,
});

/*
==================================================
EXPORT MODEL
==================================================
*/

module.exports = mongoose.model("Message", messageSchema);
