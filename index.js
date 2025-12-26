require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./auth/routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: processs.env.CORS_ORIGIN, credentials: true }));

app.get("/health", (req, res) => {
  res.json({ Health: "Good" });
});

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API Running On Port ${port}`);
});
