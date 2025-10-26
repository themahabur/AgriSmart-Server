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
router.post(
  "/farm-tasks",
  authenticateToken,
  recordActivity("task_create"),
  createFarmTask
);

router.get(
  "/farm-tasks/:email",
  authenticateToken,
  recordActivity("task_view"),
  getTasksByEmail
);
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
