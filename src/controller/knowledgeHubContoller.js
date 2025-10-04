const KnowledgeHubModule = require("../module/KnowledgeHubModule");

const createKnowledgeHubContent = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      summary,
      type,
      category,
      slug,
      body,
      media,
      tags,
      status,
      author,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !subtitle ||
      !type ||
      !category ||
      !slug ||
      !body ||
      !author
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: title, subtitle, type, category, slug, body, and author are required",
      });
    }

    // Check if slug already exists
    const existingContent = await KnowledgeHubModule.findOne({ slug });
    if (existingContent) {
      return res.status(400).json({
        success: false,
        message: "Content with this slug already exists",
      });
    }

    // Create new knowledge hub content
    const knowledgeHubContent = new KnowledgeHub({
      title,
      subtitle,
      summary: summary || "",
      type,
      category,
      slug,
      body,
      media: media || "",
      tags: tags || [],
      status: status || "draft",
      author: {
        name: author.name,
        email: author.email,
      },
    });

    const savedContent = await knowledgeHubContent.save();

    res.status(201).json({
      success: true,
      message: "Knowledge hub content created successfully",
      data: savedContent,
    });
  } catch (error) {
    console.error("Error creating knowledge hub content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create knowledge hub content",
      error: error.message,
    });
  }
};

module.exports = {
  createKnowledgeHubContent,
};
