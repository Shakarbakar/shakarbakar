/*
==================================================
LOGIN ROUTE
==================================================

This file handles user login requests.

A user can log in using their username OR email,
along with their password.

Passwords are compared using bcrypt.

==================================================
*/

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const User = require("../models/User");

/*
==================================================
POST /api/login
==================================================

Request body:
{
    identifier: "username or email",
    password: "user password"
}

Success response:
{
    success: true,
    message: "Login successful",
    user: { username, email, bucksBalance }
}

Failure response:
{
    success: false,
    message: "error description"
}

==================================================
*/

router.post("/", async (req, res) => {
  try {
    /*
        ==========================================
        READ REQUEST DATA
        ==========================================
        */

    const { identifier, password } = req.body;

    /*
        ==========================================
        BASIC VALIDATION
        ==========================================

        Both fields are required before we
        search the database.

        */

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Username or email and password are required",
      });
    }

    /*
        ==========================================
        TRIM WHITESPACE
        ==========================================

        Remove accidental spaces from the
        username or email field.

        */

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      return res.status(400).json({
        success: false,
        message: "Username or email and password are required",
      });
    }

    /*
        ==========================================
        FIND USER BY USERNAME OR EMAIL
        ==========================================

        MongoDB $or checks both fields at once.
        If the identifier contains "@", it is
        likely an email — but we still search
        both fields so either format works.

        */

    const user = await User.findOne({
      $or: [
        {
          username: {
            $regex: "^" + trimmedIdentifier + "$",
            $options: "i",
          },
        },
        {
          email: trimmedIdentifier.toLowerCase(),
        },
      ],
    });
    /*
        ==========================================
        USER NOT FOUND
        ==========================================

        Use a generic message so we do not
        reveal whether the username or email
        exists in the database.

        */

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or email, or password",
      });
    }

    /*
        ==========================================
        COMPARE PASSWORD WITH BCRYPT
        ==========================================

        bcrypt.compare checks the plain text
        password against the hashed password
        stored in MongoDB.

        */

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or email, or password",
      });
    }

    /*
        ==========================================
        SUCCESS RESPONSE
        ==========================================

        Return user info without the password.
        Session management will be added later.

        */

    res.json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bucksBalance: user.bucksBalance,
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

/*
==================================================
EXPORT ROUTE
==================================================
*/

module.exports = router;
