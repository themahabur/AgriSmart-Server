const express = require("express");

const {
  createFarmTask,
  getTasksByEmail,
} = require("../controller/farmTaskController");

const router = express.Router();

// Route to create a new farm task
router.post("/farm-tasks", createFarmTask);
router.get("/farm-tasks/:email", getTasksByEmail);

module.exports = router;
