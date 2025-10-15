const express = require("express");

const { createHistory } = require("../controller/aiHistoryController");

const router = express.Router();

// AI History Routes
router.post("/", createHistory);

module.exports = router;
