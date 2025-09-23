const { verifyToken, extractToken } = require("../utils/jwt");
const Users = require("../module/userModule");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access token required",
      });
    }

    const decoded = verifyToken(token);

    // Verify user still exists
    const user = await Users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid token",
    });
  }
};

module.exports = {
  authenticateToken,
};
