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
router.get("/farms", authenticateToken, listFarms);
router.post("/farms", authenticateToken, createFarm);
router.get("/farms/:id", authenticateToken, getFarmById);
router.put("/farms/:id", authenticateToken, updateFarm);
router.delete("/farms/:id", authenticateToken, deleteFarm);

module.exports = router;


