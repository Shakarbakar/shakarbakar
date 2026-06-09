/*
==================================================
FRIEND MODEL
==================================================

Stores accepted friendships between users.

Created when:

- Friend Request is accepted

Used by:

- Friends List
- Private Messages
- Online Friends
- Favorite Friends

==================================================
*/

const mongoose = require("mongoose");

/*
==================================================
FRIEND SCHEMA
==================================================

A friendship is stored twice:

Example:

John accepts Maria

Record 1:
John -> Maria

Record 2:
Maria -> John

This makes querying friends much faster.

==================================================
*/

const friendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  friendUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  friendUsername: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/*
==================================================
PREVENT DUPLICATES
==================================================

A user cannot have the same friend twice.

==================================================
*/

friendSchema.index(
  {
    userId: 1,
    friendUserId: 1,
  },
  {
    unique: true,
  },
);

/*
==================================================
EXPORT MODEL
==================================================
*/

module.exports = mongoose.model("Friend", friendSchema);
