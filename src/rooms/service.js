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
