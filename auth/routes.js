const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const {
  findUserByEmail,
  findUsersByUserName,
  createUser,
} = require("./service");

const router = express.Router();

/**
 *
 * in dev secure must be false
 * in production secure must be true
 * for HTTP
 */
function setAuthCookies(res, token) {
  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// router.post(
//   "/register",
//   [
//     body("email").isEmail().normalizeEmail(),
//     body("username")
//       .isLength({ min: 3, max: 50 })
//       .matches("/^[a-zA-Z0-9_]+$/")
//       .withMessage("Username must be alphanumeric/underscore"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res
//         .status(400)
//         .json({ error: "VALIDATION_ERROR", details: errors.array() });
//     }

//     const email = await findUserByEmail(email);
//     const username = await findUsersByUserName(username);

//   }
// );
