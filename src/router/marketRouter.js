const express = require("express");
const { getMarketData } = require("../controller/storeMarketController");

const router = express.Router();

router.get("/market", getMarketData);

module.exports = router;
