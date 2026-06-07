/*
==================================================
OWNERSHIP ROUTE
==================================================

Handles team ownership (buying teams).

POST /api/ownership/buy
    Buy a team for the logged-in user.

GET /api/ownership?userId=
    List all teams owned by a user.

==================================================
*/

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Team = require("../models/Team");
const Ownership = require("../models/Ownership");

/*
==================================================
POST /api/ownership/buy
==================================================

Body:
{
    userId: "mongodb user id",
    teamId: "mongodb team id"
}

==================================================
*/

router.post("/buy", async (req, res) => {

    try {

        const { userId, teamId } = req.body;

        /*
        ==========================================
        VALIDATION
        ==========================================
        */

        if (!userId || !teamId) {

            return res.status(400).json({
                success: false,
                message: "You must be logged in to buy a team"
            });

        }

        /*
        ==========================================
        LOAD USER
        ==========================================
        */

        const user = await User.findById(userId);

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "You must be logged in to buy a team"
            });

        }

        /*
        ==========================================
        LOAD TEAM
        ==========================================
        */

        const team = await Team.findById(teamId);

        if (!team) {

            return res.status(404).json({
                success: false,
                message: "Team not found"
            });

        }

        /*
        ==========================================
        CHECK DUPLICATE OWNERSHIP
        ==========================================

        A user may not buy the same team twice.

        */

        const existingOwnership = await Ownership.findOne({
            userId: user._id,
            teamId: team._id
        });

        if (existingOwnership) {

            return res.status(400).json({
                success: false,
                message: "I own " + team.name
            });

        }

        /*
        ==========================================
        CHECK BUCKS BALANCE
        ==========================================
        */

        if (user.bucksBalance < team.price) {

            return res.status(400).json({
                success: false,
                message:
                    "Not enough Bucks. You need " +
                    team.price.toLocaleString() +
                    " Bucks."
            });

        }

        /*
        ==========================================
        DEDUCT BUCKS AND CREATE OWNERSHIP
        ==========================================
        */

        user.bucksBalance = user.bucksBalance - team.price;

        await user.save();

        const ownership = new Ownership({

            userId: user._id,
            username: user.username,
            teamId: team._id,
            teamName: team.name,
            purchasePrice: team.price

        });

        await ownership.save();

        /*
        ==========================================
        SUCCESS RESPONSE
        ==========================================

        Uses ShakarBakar language:
        "I own [Team Name]"

        */

        res.json({

            success: true,
            message: "You now own " + team.name + ".",

            ownershipMessage: "I own " + team.name,

            remainingBalance: user.bucksBalance,

            user: {
                id: user._id,
                username: user.username,
                bucksBalance: user.bucksBalance
            },

            team: {
                id: team._id,
                name: team.name,
                flag: team.flag
            }

        });

    }
    catch (error) {

        console.error(error);

        // Duplicate key from unique index
        if (error.code === 11000) {

            return res.status(400).json({
                success: false,
                message: "You already own this team"
            });

        }

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

/*
==================================================
GET /api/ownership
==================================================

Returns all teams owned by a user.

==================================================
*/

router.get("/", async (req, res) => {

    try {

        const { userId } = req.query;

        if (!userId) {

            return res.status(400).json({
                success: false,
                message: "userId is required"
            });

        }

        const ownerships = await Ownership.find({
            userId: userId
        }).sort({ purchaseDate: -1 });

        res.json({

            success: true,

            ownerships: ownerships.map((o) => ({
                teamId: o.teamId,
                teamName: o.teamName,
                purchasePrice: o.purchasePrice,
                purchaseDate: o.purchaseDate,
                ownershipMessage: "I own " + o.teamName
            }))

        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

/*
==================================================
EXPORT ROUTE
==================================================
*/

module.exports = router;
