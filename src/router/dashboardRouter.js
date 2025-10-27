const express = require("express");

const { getUserDashboard } = require("../controller/userDashboardController");

const router = express.Router();

router.get("/user/:email", getUserDashboard);

module.exports = router;
