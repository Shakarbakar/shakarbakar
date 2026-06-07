/*
==================================================
TEAM MODEL
==================================================

Stores national teams available in the
ShakarBakar Teams Marketplace.

Each team has a price based on World Cup titles:
price = basePrice + (worldCupTitles × 100)

==================================================
*/

const mongoose = require("mongoose");

/*
==================================================
TEAM SCHEMA
==================================================
*/

const teamSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },

    flag: {
        type: String,
        required: true
    },

    basePrice: {
        type: Number,
        default: 500
    },

    worldCupTitles: {
        type: Number,
        default: 0
    },

    stars: {
        type: String,
        default: ""
    },

    price: {
        type: Number,
        required: true
    },

    qualificationStatus: {
        type: String,
        default: "Qualified"
    },

    winningChance: {
        type: Number,
        default: 1
    }

});

/*
==================================================
EXPORT MODEL
==================================================
*/

module.exports = mongoose.model("Team", teamSchema);
