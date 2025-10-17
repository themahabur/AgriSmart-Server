const express = require("express");

const { createFarmTask } = require("../controller/farmTaskController");

const router = express.Router();

// Route to create a new farm task
router.post("/farm-tasks", createFarmTask);

module.exports = router;
