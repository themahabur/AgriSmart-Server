const express = require("express");
const {
  listFarms,
  createFarm,
  getFarmById,
  updateFarm,
  deleteFarm,
} = require("../controller/farmController");
const { authenticateToken } = require("../middleware/authentication");

const router = express.Router();

// Farms (all routes are protected)
router.get("/farms/:email", listFarms);
router.post("/farms", createFarm);
router.get("/farms/:id", getFarmById);
router.put("/farms/:id", updateFarm);
router.delete("/farms/:id", deleteFarm);

module.exports = router;
