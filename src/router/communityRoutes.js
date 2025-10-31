const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  createComment,
} = require("../controller/communityController");

// Import your authentication middleware
const { authenticateToken } = require("../middleware/authentication");

// --- POST ROUTES ---
// Base Path: /api/community

router
  .route("/")
  .get(getAllPosts) // GET /api/community
  .post(authenticateToken, createPost);

// router
//   .route("/:id")
//   .get(getPostById) // GET /api/community/some_post_id
//   .delete(authenticateToken, deletePost);

// // --- LIKE ROUTE ---
// // Base Path: /api/community
// router.patch("/:id/like", authenticateToken, likePost);

// // --- COMMENT ROUTE ---
// // A common RESTful pattern for a nested resource
// // Base Path: /api/community
// router.post("/:postId/comments", authenticateToken, createComment);

module.exports = router;
