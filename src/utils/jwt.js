const jwt = require("jsonwebtoken");

const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

const verifyToken = (token) => {
  if (!token) throw new Error("No token provided");

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid JWT: " + err.message);
  }
};

const extractToken = (token) => {
  // const authHeader = token.headers.authorization;
  if (token && token.startsWith("Bearer ")) {
    return token.split(" ")[1];
  }
  return null;
};

module.exports = { generateToken, verifyToken, extractToken };
