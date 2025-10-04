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

const getKnowledgeHubContent = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      type,
      status = "published",
      tags,
      author,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query object
    let query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    if (author) {
      query["author.email"] = author;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get total count for pagination
    const totalRecords = await KnowledgeHub.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    // Fetch knowledge hub content with pagination and sorting
    const content = await KnowledgeHub.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    res.status(200).json({
      success: true,
      data: content,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
      message: `Found ${content.length} knowledge hub content records`,
    });
  } catch (error) {
    console.error("Error fetching knowledge hub content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch knowledge hub content",
      error: error.message,
    });
  }
};

const getKnowledgeHubContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await KnowledgeHub.findOne({ slug });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Knowledge hub content not found",
      });
    }

    // Increment views count
    await KnowledgeHub.findByIdAndUpdate(content._id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      data: content,
      message: "Knowledge hub content retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching knowledge hub content by slug:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch knowledge hub content",
      error: error.message,
    });
  }
};

const updateKnowledgeHubContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedContent = await KnowledgeHub.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: "Knowledge hub content not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedContent,
      message: "Knowledge hub content updated successfully",
    });
  } catch (error) {
    console.error("Error updating knowledge hub content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update knowledge hub content",
      error: error.message,
    });
  }
};

module.exports = {
  createKnowledgeHubContent,
  getKnowledgeHubContent,
  getKnowledgeHubContentBySlug,
  updateKnowledgeHubContent,
  deleteKnowledgeHubContent,
};
