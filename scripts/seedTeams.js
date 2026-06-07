/*
==================================================
SEED TEAMS SCRIPT
==================================================

Populates the teams collection with all 48
FIFA World Cup 2026 qualified national teams.

Run once:
node scripts/seedTeams.js

Safe to run again — uses upsert by team name.

==================================================
*/

require("dotenv").config();

const mongoose = require("mongoose");

const Team = require("../models/Team");
const fifaTeams = require("../data/fifaWorldCup2026Teams");

/*
==================================================
HELPER — BUILD STARS FROM TITLES
==================================================
*/

function buildStars(worldCupTitles) {

    // Each World Cup title = one gold star
    return "★".repeat(worldCupTitles);

}

/*
==================================================
HELPER — CALCULATE PRICE
==================================================
*/

function calculatePrice(worldCupTitles) {

    const basePrice = 500;

    // price = 500 + (worldCupTitles × 100)
    return basePrice + (worldCupTitles * 100);

}

/*
==================================================
SEED DATABASE
==================================================
*/

async function seedTeams() {

    try {

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
        });

        console.log("✅ MongoDB Connected");
        console.log("Seeding " + fifaTeams.length + " teams...");

        let inserted = 0;
        let updated = 0;

        for (const teamData of fifaTeams) {

            const basePrice = 500;
            const worldCupTitles = teamData.worldCupTitles;
            const price = calculatePrice(worldCupTitles);
            const stars = buildStars(worldCupTitles);

            const result = await Team.updateOne(

                { name: teamData.name },

                {
                    $set: {
                        name: teamData.name,
                        flag: teamData.flag,
                        basePrice: basePrice,
                        worldCupTitles: worldCupTitles,
                        stars: stars,
                        price: price,
                        qualificationStatus: teamData.qualificationStatus,
                        winningChance: teamData.winningChance
                    }
                },

                { upsert: true }

            );

            if (result.upsertedCount > 0) {
                inserted++;
            }
            else if (result.modifiedCount > 0) {
                updated++;
            }

        }

        const total = await Team.countDocuments();

        console.log("====================================");
        console.log("Inserted:", inserted);
        console.log("Updated:", updated);
        console.log("Total teams in database:", total);
        console.log("====================================");

        await mongoose.disconnect();

        process.exit(0);

    }
    catch (error) {

        console.error("Seed error:", error);
        process.exit(1);

    }

}

seedTeams();
