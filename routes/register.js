/*
==================================================
REGISTER ROUTE
==================================================
*/

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const User = require("../models/User");

/*
==================================================
POST /api/register
==================================================
*/

router.post("/", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    /*
    ==========================================
    BASIC VALIDATION
    ==========================================
    */

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /*
    ==========================================
    NORMALIZE INPUT
    ==========================================
    */

    username = username.trim();

    email = email.trim().toLowerCase();

    /*
    ==========================================
    CHECK EXISTING USERNAME
    CASE INSENSITIVE
    ==========================================
    */

    const existingUsername = await User.findOne({
      username: {
        $regex: "^" + username + "$",
        $options: "i",
      },
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    /*
    ==========================================
    CHECK EXISTING EMAIL
    ==========================================
    */

    const existingEmail = await User.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    /*
    ==========================================
    HASH PASSWORD
    ==========================================
    */

    const hashedPassword = await bcrypt.hash(password, 10);

    /*
    ==========================================
    CREATE USER
    ==========================================
    */

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    /*
    ==========================================
    SAVE USER
    ==========================================
    */

    await newUser.save();

    /*
    ==========================================
    SUCCESS RESPONSE
    ==========================================
    */

    res.json({
      success: true,
      message: "Account created successfully",

      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        bucksBalance: newUser.bucksBalance,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
