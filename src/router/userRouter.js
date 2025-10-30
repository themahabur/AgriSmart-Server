const express = require("express");
const { loginUser } = require("../controller/loginController");
const {
  registerUser,
  googleRegister,
} = require("../controller/registerController");
const {
  getCurrentUser,
  getUserByEmail,
  searchUsers,
  getAllUsers,
  getUserById,
  updateUser,
} = require("../controller/userContoller");
const { authenticateToken } = require("../middleware/authentication");

const router = express.Router();

router.post("/register", registerUser); // registration
router.post("/login", loginUser); // login
router.post("/google", googleRegister); // google registration

// GET routes for user data
router.get("/me", authenticateToken, getCurrentUser); // Get current authenticated user's data
// router.get("/me/:email", getUserByEmail); // Get current authenticated user's data
router.get("/search", searchUsers); // Search users (public)
router.get("/all", getAllUsers); // Get all users with pagination (protected)
router.get("/:userId", getUserById); // Get user by ID (public profile)

// Update user profile (only for the user themselves)
router.patch("/me", authenticateToken, updateUser);

module.exports = router;
