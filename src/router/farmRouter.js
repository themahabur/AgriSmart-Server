const express = require("express");
const {
  listFarms,
  createFarm,
  getFarmById,
  updateFarm,
  deleteFarm,
} = require("../controller/farmController");
const { authenticateToken } = require("../middleware/authentication");
const recordActivity = require("../middleware/recentActivity");

const router = express.Router();

// Farms (all routes are protected)
router.get("/farms/:email", listFarms);
router.post("/farms", recordActivity("farm_create"), createFarm);
router.get("/farms/:id", getFarmById);
router.put("/farms/:id", recordActivity("farm_update"), updateFarm);
router.delete("/farms/:id", recordActivity("farm_delete"), deleteFarm);

module.exports = router;
