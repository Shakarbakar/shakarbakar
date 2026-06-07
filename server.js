/*
==================================================
SHAKARBAKAR - VERSION 2
MAIN SERVER FILE
==================================================
*/

/*
==================================================
IMPORT PACKAGES
==================================================
*/

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

/*
==================================================
IMPORT ROUTES
==================================================
*/

const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const teamsRoute = require("./routes/teams");
const ownershipRoute = require("./routes/ownership");

/*
==================================================
CREATE EXPRESS APP
==================================================
*/

const app = express();

/*
==================================================
MIDDLEWARE
==================================================
*/

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/*
==================================================
ROUTES
==================================================
*/

app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/teams", teamsRoute);
app.use("/api/ownership", ownershipRoute);

/*
==================================================
MONGODB CONNECTION
==================================================
*/

console.log("====================================");
console.log("MONGO_URI =", process.env.MONGO_URI);
console.log("====================================");

mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error("❌ MongoDB Connection Error");
        console.error("");

        console.error("NAME:");
        console.error(error.name);

        console.error("");
        console.error("MESSAGE:");
        console.error(error.message);

        console.error("");
        console.error("CAUSE:");
        console.dir(error.cause, { depth: null });

        console.error("");
        console.error("REASON:");
        console.dir(error.reason, { depth: null });

        console.error("");
        console.error("FULL ERROR:");
        console.dir(error, { depth: null });
    });

/*
==================================================
TEST ROUTE
==================================================
*/

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "ShakarBakar server is running!",
    });
});

/*
==================================================
SERVER START
==================================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`ShakarBakar running on port ${PORT}`);
});
