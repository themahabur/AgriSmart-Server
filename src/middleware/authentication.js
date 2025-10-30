const { verifyToken, extractToken } = require("../utils/jwt");
const Users = require("../module/userModule");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to check if token is a JWT
const isJwt = (token) => {
  return typeof token === "string" && token.split(".").length === 3;
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = extractToken(authHeader);

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Access token required",
    });
  }

  let decoded;
  let user;

  // First try: verify as manual JWT
  if (isJwt(token)) {
    try {
      decoded = verifyToken(token); // your own JWT
      // console.log("✅ Manual token verified:", decoded);

      user = await Users.findById(decoded.id);
      if (!user) throw new Error("User not found");

      req.user = {
        id: user._id,
        email: user.email,
        name: user.name,
        loginType: "manual",
      };

      return next();
    } catch (manualErr) {
      console.warn("Manual token failed:", manualErr.message);
    }
  }

  // Try Google ID token
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    decoded = ticket.getPayload();
    // console.log("✅ Google token verified:", decoded);

    user = await Users.findOne({ email: decoded.email });
    if (!user) throw new Error("User not found");

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      loginType: "google",
    };

    return next();
  } catch (googleErr) {
    // console.warn("Google token failed:", googleErr.message);
  }

  // If both verifications fail
  return res.status(401).json({
    status: false,
    message: "Invalid or expired token",
  });
};

module.exports = {
  authenticateToken,
};
