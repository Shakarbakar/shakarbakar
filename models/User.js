/*
==================================================
USER MODEL
==================================================
*/

const mongoose = require("mongoose");

/*
==================================================
USER SCHEMA
==================================================
*/

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    bucksBalance: {
        type: Number,
        default: 10000
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

/*
==================================================
EXPORT MODEL
==================================================
*/

module.exports = mongoose.model("User", userSchema);
