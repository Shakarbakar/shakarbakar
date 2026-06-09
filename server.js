/*
==================================================
SHAKARBAKAR - VERSION 3
MAIN SERVER FILE
==================================================
*/

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

/*
==================================================
ROUTES
==================================================
*/

const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const teamsRoute = require("./routes/teams");
const ownershipRoute = require("./routes/ownership");

const chatRoute = require("./routes/chat");
const duelsRoute = require("./routes/duels");
const usersRoute = require("./routes/users");

/*
==================================================
APP
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
API ROUTES
==================================================
*/

app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/teams", teamsRoute);
app.use("/api/ownership", ownershipRoute);

app.use("/api/chat", chatRoute);
app.use("/api/duels", duelsRoute);
app.use("/api/users", usersRoute);

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
MONGODB
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
    console.error(error);
  });

/*
==================================================
START SERVER
==================================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ShakarBakar running on port ${PORT}`);
});
