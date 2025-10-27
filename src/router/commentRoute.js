const express = require("express");
const router = express.Router();
const {
  getBlogComments,
  createComment,
  addReply,
  getCommentStats,
  deleteComment,
  deleteReply,
} = require("../controller/commentController");

router.get("/blog/:blogSlug", getBlogComments);
router.post("/", createComment);
router.post("/:commentId/reply", addReply);
router.get("/stats/:blogSlug", getCommentStats);

router.delete("/:commentId", deleteComment);

router.delete("/:commentId/replies/:replyId", deleteReply);

module.exports = router;
