const express = require("express");

const {
  createHistory,
  getAllAiHistory,
  deleteAllHistory,
} = require("../controller/aiHistoryController");

const router = express.Router();

// AI History Routes
router.get("/", getAllAiHistory);
router.post("/", createHistory);
router.delete("/", deleteAllHistory);

module.exports = router;
