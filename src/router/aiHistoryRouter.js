const express = require("express");

import { createDiagnosis } from "../controller/aiHistoryContoller";

const router = express.Router();

// AI History Routes
router.post("/", createDiagnosis);

module.exports = router;
