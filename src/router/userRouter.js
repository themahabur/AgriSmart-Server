const express = require("express");
const {
  createUser,
  getAllUsers,
  getUser,
} = require("../controller/userController");

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:email", getUser);

module.exports = router;
