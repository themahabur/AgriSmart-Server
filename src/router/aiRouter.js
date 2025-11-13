const express = require("express");
const router = express.Router();

const { getAiSuggestions } = require("../controller/aiController");

const { authenticateToken } = require("../middleware/authentication");

router.post("/ai-suggestions", authenticateToken, getAiSuggestions);

module.exports = router;
