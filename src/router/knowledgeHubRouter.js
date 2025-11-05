const express = require("express");

const {
  getKnowledgeHubContent,
  getKnowledgeHubContentBySlug,
  createKnowledgeHubContent,
  updateKnowledgeHubContent,
  deleteKnowledgeHubContent,
  getPopularKnowledgeHubContent,
  getRelatedKnowledgeHubContent,
  toggleBookmark,
  toggleLike,
  getLikeCount,
  getBookmarkCount,
} = require("../controller/knowledgeHubContoller");
const { authenticateToken } = require("../middleware/authentication");
const recordActivity = require("../middleware/recentActivity");

const router = express.Router();

router.get("/knowledge-hub", getKnowledgeHubContent);
router.get("/knowledge-hub/slug/:slug", getKnowledgeHubContentBySlug);

router.post(
  "/knowledge-hub",
  authenticateToken,
  recordActivity("create_knowledge_hub_content"),
  createKnowledgeHubContent
);
router.put(
  "/knowledge-hub/:id",
  authenticateToken,
  recordActivity("update_knowledge_hub_content"),
  updateKnowledgeHubContent
);
router.delete(
  "/knowledge-hub/:id",
  authenticateToken,
  recordActivity("delete_knowledge_hub_content"),
  deleteKnowledgeHubContent
);

router.post(
  "/knowledge-hub/:id/like",
  toggleLike
);

router.post(
  "/knowledge-hub/:id/bookmark",
  toggleBookmark
);

router.get("/knowledge-hub/popular", getPopularKnowledgeHubContent);
router.get("/knowledge-hub/related", getRelatedKnowledgeHubContent);

router.get("/knowledge-hub/:id/like-count", getLikeCount);
router.get("/knowledge-hub/:id/bookmark-count", getBookmarkCount);

module.exports = router;
