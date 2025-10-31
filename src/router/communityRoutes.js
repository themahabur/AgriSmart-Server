const express = require("express");
const {
  createPost,
  getAllPosts,
  getSinglePost,
  likePost,
} = require("../controller/communityController");
const { authenticateToken } = require("../middleware/authentication");

const router = express.Router();

router.post("/create", authenticateToken, createPost);
router.get("/", authenticateToken, getAllPosts);
router.get("/:id", authenticateToken, getSinglePost);
router.patch("/posts/:id/like", authenticateToken, likePost);

module.exports = router;
