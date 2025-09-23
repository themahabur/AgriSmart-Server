const jwt = require("jsonwebtoken");

const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const extractToken = (token) => {
  const authHeader = token.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

module.exports = { generateToken, verifyToken, extractToken };
