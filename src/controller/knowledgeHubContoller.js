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
    const knowledgeHubContent = new KnowledgeHubModule({
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
    const totalRecords = await KnowledgeHubModule.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    // Fetch knowledge hub content with pagination and sorting
    const content = await KnowledgeHubModule.find(query)
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

    const content = await KnowledgeHubModule.findOne({ slug });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Knowledge hub content not found",
      });
    }

    await KnowledgeHubModule.findByIdAndUpdate(content._id, {
      $inc: { views: 1 },
    });

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

    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedContent = await KnowledgeHubModule.findByIdAndUpdate(
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

const deleteKnowledgeHubContent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContent = await KnowledgeHubModule.findByIdAndDelete(id);

    if (!deletedContent) {
      return res.status(404).json({
        success: false,
        message: "Knowledge hub content not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Knowledge hub content deleted successfully",
      data: { id: deletedContent._id },
    });
  } catch (error) {
    console.error("Error deleting knowledge hub content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete knowledge hub content",
      error: error.message,
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await KnowledgeHubModule.findById(id);
    
    if (!content) {
      return res.status(404).json({ 
        success: false, 
        message: "Content not found" 
      });
    }

    content.likes = (content.likes || 0) + 1;
    await content.save();

    res.status(200).json({
      success: true,
      message: "Like added successfully",
      data: { 
        likes: content.likes 
      },
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle like",
      error: error.message,
    });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await KnowledgeHubModule.findById(id);
    
    if (!content) {
      return res.status(404).json({ 
        success: false, 
        message: "Content not found" 
      });
    }

    content.bookmarkCount = (content.bookmarkCount || 0) + 1;
    await content.save();

    res.status(200).json({
      success: true,
      message: "Bookmark added successfully",
      data: { 
        bookmarkCount: content.bookmarkCount
      },
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle bookmark",
      error: error.message,
    });
  }
};


const getPopularKnowledgeHubContent = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const popularContent = await KnowledgeHubModule.find({ status: "published" })
      .sort({ likes: -1, views: -1 })
      .limit(limit)
      .lean();

    if (popularContent.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No popular knowledge hub content found",
      });
    }

    res.status(200).json({
      success: true,
      data: popularContent,
      message: "Popular knowledge hub content retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching popular knowledge hub content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular knowledge hub content",
      error: error.message,
    });
  }
};


const getRelatedKnowledgeHubContent = async (req, res) => {
  try {
    const { tags } = req.query;
    const limit = parseInt(req.query.limit) || 5;

    if (!tags) {
      return res.status(400).json({
        success: false,
        message: "Tags are required to find related content",
      });
    }

    const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    const relatedContent = await KnowledgeHubModule.find({
      tags: { $in: tagArray },
      status: "published",
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    if (relatedContent.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No related knowledge hub content found",
      });
    }

    res.status(200).json({
      success: true,
      data: relatedContent,
      message: "Related knowledge hub content retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching related knowledge hub content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch related knowledge hub content",
      error: error.message,
    });
  }
};

const getLikeCount = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await KnowledgeHubModule.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.status(200).json({
      success: true,
      likeCount: content.likes || 0, 
      message: "Like count retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching like count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch like count",
      error: error.message,
    });
  }
};

const getBookmarkCount = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await KnowledgeHubModule.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.status(200).json({
      success: true,
      bookmarkCount: content.bookmarkCount || 0,
      message: "Bookmark count retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching bookmark count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookmark count",
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
  toggleLike,
  toggleBookmark,
  getPopularKnowledgeHubContent,
  getRelatedKnowledgeHubContent,
  getLikeCount,
  getBookmarkCount,
};
