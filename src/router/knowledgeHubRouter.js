const express = require("express");

const {
  getKnowledgeHubContent,
  getKnowledgeHubContentBySlug,
  createKnowledgeHubContent,
  updateKnowledgeHubContent,
  deleteKnowledgeHubContent,
} = require("../controller/knowledgeHubContoller");
const { authenticateToken } = require("../middleware/authentication");

const router = express.Router();

// Public routes
router.get("/knowledge-hub", getKnowledgeHubContent);
router.get("/knowledge-hub/slug/:slug", getKnowledgeHubContentBySlug);

// Protected routes (require authentication)
router.post("/knowledge-hub", createKnowledgeHubContent);
router.put("/knowledge-hub/:id", updateKnowledgeHubContent);
router.delete(
  "/knowledge-hub/:id",

  deleteKnowledgeHubContent
);

module.exports = router;
