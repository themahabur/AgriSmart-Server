const express = require("express");

const { getUserDashboard } = require("../controller/userDashboardController");

const router = express.Router();

router.get("/dashboard/:email", getUserDashboard);

module.exports = router;
