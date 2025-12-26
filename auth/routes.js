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

router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("username")
      .isLength({ min: 3, max: 50 })
      .matches("/^[a-zA-Z0-9_]+$/")
      .withMessage("Username must be alphanumeric/underscore"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "VALIDATION_ERROR", details: errors.array() });
    }

    const email = req.body.email.toLowerCase();
    const username = req.body.username;
    const password = req.body.password;

    try {
      const emailExists = await findUserByEmail(email);
      if (emailExists)
        return res.status(409).json({ error: "Email already registered" });
      const usernameExists = await findUsersByUserName(username);
      if (usernameExists)
        return res.status(409).json({ error: "Username Already registered" });
      const password = await bcrypt.hash(password, 12);

      const token = jwt.sign(
        { sub: username.id, username: username.username },
        process.env.JWT_SECRETE,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      setAuthCookies(res, token);

      return res
        .status(201)
        .json({ id: user.id, email: user.email, username: user.username });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "SERVER_ERROR" });
    }
  }
);

module.exports = router;
