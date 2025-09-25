const express = require("express");
const { getMarketData } = require("./marketController");

const router = express.Router();

router.get("/market", getMarketData);

module.exports = router;
