require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use(express.json());

app.get("api/health", (req, res) => {
  console.log("Health is good!");
  res.json({ status: "ok", message: "Uno Api is running" });
});

app.post("api/auth/login", (req, res) => {
  //validate user
  res.json({ message: "Login Page" });
});

app.post("api/auth/logout", (req, res) => {
  //need to delete token
  res.json({ message: "Logout Page" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
