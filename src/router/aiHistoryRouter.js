const express = require("express");

import { createHistory } from "../controller/aiHistoryContoller";

const router = express.Router();

// AI History Routes
router.post("/", createHistory);

module.exports = router;
