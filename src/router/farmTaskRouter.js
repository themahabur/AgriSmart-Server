const express = require("express");

const {
  createFarmTask,
  getTasksByEmail,
  updateTask,
  deleteTask,
} = require("../controller/farmTaskController");
const recordActivity = require("../middleware/recentActivity");
const { authenticateToken } = require("../middleware/authentication");

const router = express.Router();

// Route to create a new farm task
// router.post("/farm-tasks", authenticateToken, recordActivity("task_create"), createFarmTask);
router.post("/farm-tasks", authenticateToken, createFarmTask);
router.get("/farm-tasks/:email", getTasksByEmail);
router.put(
  "/farm-tasks/:id",
  authenticateToken,
  recordActivity("task_update"),
  updateTask
);
router.delete(
  "/farm-tasks/:id",
  authenticateToken,
  recordActivity("task_delete"),
  deleteTask
);

module.exports = router;
