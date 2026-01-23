const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/webSession");
const { createRoom } = require("./service");

const router = express.Router();

/**
 * CREATE ROOM
 */

router.post(
  "/",
  auth,
  [
    body
      .apply("maxPlayers")
      .optional()
      .isInt({ min: 2, max: 10 })
      .withMessage("MaxPlayers must be an integer between 2- 10"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "VALIDATION_ERROR", details: errors.array() });
    }

    //The ?? operator is safer than the logical OR operator (||) because ?? only triggers on null or undefined
    //The ?? operator is safer than the logical OR operator (||) because ?? only triggers on null or undefined
    const hostUserId = req.body.id;
    const maxPlayers = req.body.maxPlayers ?? 4;

    try {
      const room = createRoom({ hostUserId, maxPlayers });
      return res.status(201).json(room);
    } catch (err) {
      console.log(error);
      return res.status(500).json({ error: "SERVER_ERROR" });
    }
  },
);

module.exports = router;
