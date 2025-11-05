const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
} = require("../controller/messageController");
const { authenticateToken } = require("../middleware/authentication");

router.post("/", authenticateToken, createMessage);
router.get("/", authenticateToken, getMessages);

module.exports = router;
