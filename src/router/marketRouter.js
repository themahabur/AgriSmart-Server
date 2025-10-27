const express = require("express");
const {
  getMarketData,
  fetchAndStoreMarketData,
} = require("../controller/storeMarketController");

const router = express.Router();

router.get("/market", getMarketData);
router.post("/market/update", fetchAndStoreMarketData);

module.exports = router;
