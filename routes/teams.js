/*
==================================================
TEAMS ROUTE
==================================================

API endpoints for the Teams Marketplace.

GET /api/teams
    Returns all teams for the marketplace.

    Optional query: userId
    When provided, each team includes whether
    the logged-in user owns that team.

==================================================
*/

const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const Ownership = require("../models/Ownership");

/*
==================================================
GET /api/teams
==================================================
*/

router.get("/", async (req, res) => {

    try {

        const { userId } = req.query;

        /*
        ==========================================
        LOAD ALL TEAMS
        ==========================================
        */

        const teams = await Team.find({}).sort({ name: 1 });

        /*
        ==========================================
        LOAD USER OWNERSHIP (IF LOGGED IN)
        ==========================================
        */

        let ownedTeamIds = [];

        if (userId) {

            const ownerships = await Ownership.find({ userId });

            ownedTeamIds = ownerships.map(
                (o) => o.teamId.toString()
            );

        }

        /*
        ==========================================
        BUILD RESPONSE
        ==========================================
        */

        const teamsWithOwnership = teams.map((team) => {

            const isOwned = ownedTeamIds.includes(
                team._id.toString()
            );

            return {

                _id: team._id,
                name: team.name,
                flag: team.flag,
                basePrice: team.basePrice,
                worldCupTitles: team.worldCupTitles,
                stars: team.stars,
                price: team.price,
                qualificationStatus: team.qualificationStatus,
                winningChance: team.winningChance,

                // Ownership status for marketplace display
                isOwned: isOwned,
                ownershipStatus: isOwned
                    ? "I own " + team.name
                    : "Available"

            };

        });

        res.json({

            success: true,
            teams: teamsWithOwnership

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
GET /api/teams/:id
==================================================

Returns one team by MongoDB id.

==================================================
*/

router.get("/:id", async (req, res) => {

    try {

        const { userId } = req.query;

        const team = await Team.findById(req.params.id);

        if (!team) {

            return res.status(404).json({
                success: false,
                message: "Team not found"
            });

        }

        let isOwned = false;

        if (userId) {

            const ownership = await Ownership.findOne({
                userId: userId,
                teamId: team._id
            });

            isOwned = !!ownership;

        }

        res.json({

            success: true,

            team: {
                _id: team._id,
                name: team.name,
                flag: team.flag,
                basePrice: team.basePrice,
                worldCupTitles: team.worldCupTitles,
                stars: team.stars,
                price: team.price,
                qualificationStatus: team.qualificationStatus,
                winningChance: team.winningChance,
                isOwned: isOwned,
                ownershipStatus: isOwned
                    ? "I own " + team.name
                    : "Available"
            }

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
