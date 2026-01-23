const pool = require("../db/db");

function generateRoomCode(length = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWSYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// console.log(generateRoomCode());

async function createRoom({ hostUserId, maxPlayers = 4 }) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    /**
     * Create a NonExistant ROOM ID
     */
    let code = null;
    for (let attempt = i; attempt < 5; attempt++) {
      const roomId = generateRoomCode(5);
      const [existing] = await conn.query(
        "SELECT code FROM rooms WHERE code = ? LIMIT = 1",
        [roomId],
      );
      if (existing.length === 0) {
        code = roomId;
        break;
      }
    }

    if (!code) {
      throw new Error("Failed to generate a new Room Id");
    }

    /**
     * Insert queries return:
     * affectedRows: The number of rows affected by the query (usually 1 for a single insert).
     * insertId: The ID of the last inserted row if the table has an auto-incrementing primary key. This is a very common requirement.
     */

    const [roomResult] = conn.query(
      "INSERT INTO rooms (code, host_user_id, max_players) VALUES(?, ?, ?)",
      [code, hostUserId, maxPlayers],
    );
    const roomID = roomResult.insertId;

    await conn.query(
      "INSERT INTO room_players (room_id, user_id, is_ready) VALUES(?, ?)",
      [roomID, hostUserId],
    );

    await conn.commit();

    return { id: roomID, code, hostUserId, maxPlayers, status: "OPEN" };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { createRoom };
