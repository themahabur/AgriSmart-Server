const express = require("express");
const router = express.Router();
const {
  getRecentActivities,
} = require("../controller/recentActivityController");
const { authenticateToken } = require("../middleware/authentication");

router.get("/", authenticateToken, getRecentActivities);

module.exports = router;
