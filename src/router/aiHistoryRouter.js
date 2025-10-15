const express = require("express");

const {
  createHistory,
  getAllAiHistory,
} = require("../controller/aiHistoryController");

const router = express.Router();

// AI History Routes
router.post("/", createHistory);
router.get("/", getAllAiHistory);

module.exports = router;
