const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "AUTHENTICATION_ERROR" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRETE);
    req.user = { id: payload.sub, username: payload.username };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "AUTHENTICATION_ERROR" });
  }
}

module.exports = { authenticate };
