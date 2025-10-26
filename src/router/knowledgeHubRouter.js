const express = require("express");

const {
  getKnowledgeHubContent,
  getKnowledgeHubContentBySlug,
  createKnowledgeHubContent,
  updateKnowledgeHubContent,
  deleteKnowledgeHubContent,
} = require("../controller/knowledgeHubContoller");
const { authenticateToken } = require("../middleware/authentication");
const recordActivity = require("../middleware/recentActivity");

const router = express.Router();

// Public routes
router.get("/knowledge-hub", getKnowledgeHubContent);
router.get("/knowledge-hub/slug/:slug", getKnowledgeHubContentBySlug);

// Protected routes (require authentication)
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

module.exports = router;
