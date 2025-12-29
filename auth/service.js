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
async function createUser(email, username, passwordHash) {
  const [result] = await pool.query(
    "INSERT INTO users(email, username, password_hash) VALUES(?, ?, ?)",
    [email, username, passwordHash]
  );
  return { id: result.insertId, email, username };
}

/**
 * Method fecthing user details adter signing in
 *
 */
async function getUserLogin(identifier) {
  const [row] = await pool.query(
    "SELECT id, email, username, password_hash FROM users WHERE email = ? OR username = ? LIIT 1",
    [identifier, identifier]
  );

  return row[0] || null;
}

module.exports = {
  findUserByEmail,
  findUsersByUserName,
  getUserLogin,
  createUser,
};
