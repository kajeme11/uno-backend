const pool = require("../db/db");

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id from users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

async function findUsersByUserName(username) {
  const [rows] = await pool.query(
    "SELECT username FROM users WHERE username = ? LIMIT 1",
    [username]
  );
  return rows[0] || null;
}

/**
 * 
 * 
 * OKPacket that useually looks like this after an insert
 {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 42,
  serverStatus: 2,
  warningCount: 0
}
 * 
 */
async function createUser({ email, username, password_hash }) {
  const [result] = await pool.query(
    "INSERT INTO user(email, username, password_hash) VALUES(?, ?, ?)",
    [email, username, password_hash]
  );
  return { id: result.insertId, email, username };
}

module.exports = {
  findUserByEmail,
  findUsersByUserName,
  createUser,
};
