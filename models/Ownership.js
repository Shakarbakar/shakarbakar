/*
==================================================
OWNERSHIP MODEL
==================================================

Records which teams a user owns in their
ShakarBakar portfolio.

Rules:
- Multiple users can own the same team
- One user cannot own the same team twice

==================================================
*/

const mongoose = require("mongoose");

/*
==================================================
OWNERSHIP SCHEMA
==================================================
*/

const ownershipSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    username: {
        type: String,
        required: true
    },

    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },

    teamName: {
        type: String,
        required: true
    },

    purchasePrice: {
        type: Number,
        required: true
    },

    purchaseDate: {
        type: Date,
        default: Date.now
    }

});

/*
==================================================
PREVENT DUPLICATE OWNERSHIP
==================================================

A user may only own each team once.

*/

ownershipSchema.index(
    { userId: 1, teamId: 1 },
    { unique: true }
);

/*
==================================================
EXPORT MODEL
==================================================
*/

module.exports = mongoose.model("Ownership", ownershipSchema);
