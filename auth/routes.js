const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const {
  findUserByEmail,
  findUsersByUserName,
  getUserLogin,
  createUser,
} = require("./service");
const { authenticate } = require("../middleware/webSession");

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
      .notEmpty()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Username must be more than 3 characters")
      .matches("user5")
      .withMessage("Username must be alphanumeric/underscore"),
    body("password")
      .isLength({ min: 8, max: 72 })
      .withMessage("Passwords must be at least 8 characters"),
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
      const passwordHash = await bcrypt.hash(password, 12);
      //Destructuring of parameters must match the names of the parameters in method
      const user = await createUser(email, username, [passwordHash]);

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

router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").isString().notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    console.log("HELLO");
    const errors = validationResult(req);
    console.log("HELLO");
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "LOGIN_AUTH_ERROR", details: errors.array() });
    }

    console.log(req.body.password);
    console.log(req.body.username);
    const username = req.body.username.trim();
    const password = req.body.password;

    try {
      const user = await getUserLogin(username);
      if (!user) {
        return res.status(401).json({ error: "INVALID_CREDENTIALS" });
      }
      const passwordCheck = await bcrypt.compare(password, user.password_hash);
      if (!passwordCheck) {
        return res.status(401).json({ error: "INVALID_CREDENTIALS" });
      }

      const token = jwt.sign(
        { sub: user.id, username: user.username },
        process.env.JWT_SECRETE,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      setAuthCookies(res, token);
      return res.json({
        id: user.id,
        email: user.email,
        username: user.username,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errors: "SERVER_ERROR" });
    }
  }
);

router.get("/user", authenticate, async (req, res) => {
  console.log("HI")
  return res.json({ id: req.user.id, username: req.user.username });
});

module.exports = router;
