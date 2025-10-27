const Comment = require("../module/Comment");

// GET /api/comments/blog/:blogSlug
exports.getBlogComments = async (req, res) => {
  try {
    const { blogSlug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ blogSlug, isApproved: true, isSpam: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments({ blogSlug, isApproved: true, isSpam: false }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      message: "Comments retrieved successfully",
      data: comments,
      pagination: { currentPage: page, totalPages, totalItems: total },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// POST /api/comments
exports.createComment = async (req, res) => {
  try {
    const { blogSlug, name, email, comment, rating } = req.body;

    if (!blogSlug || !comment || !name || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newComment = await Comment.create({
      blogSlug,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      comment: comment.trim(),
      rating: rating || null,
      userIP: req.ip,
      userAgent: req.get("User-Agent"),
      isApproved: true,
    });

    res.status(201).json({
      success: true,
      message: "Comment submitted successfully",
      data: newComment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// POST /api/comments/:commentId/reply
exports.addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { name, email, comment } = req.body;

    if (!commentId || !comment || !name || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const parent = await Comment.findById(commentId);
    if (!parent)
      return res.status(404).json({ success: false, message: "Comment not found" });

    parent.replies.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      comment: comment.trim(),
      isApproved: true,
    });

    await parent.save();

    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      data: parent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// DELETE /api/comments/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleted = await Comment.findByIdAndDelete(commentId);
    if (!deleted) return res.status(404).json({ success: false, message: "Comment not found" });

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// DELETE /api/comments/:commentId/replies/:replyId
exports.deleteReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const parent = await Comment.findById(commentId);
    if (!parent) return res.status(404).json({ success: false, message: "Comment not found" });

    const replyIndex = parent.replies.findIndex(r => r._id.toString() === replyId);
    if (replyIndex === -1) return res.status(404).json({ success: false, message: "Reply not found" });

    parent.replies.splice(replyIndex, 1);
    await parent.save();

    res.json({ success: true, message: "Reply deleted successfully", data: parent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// GET /api/comments/stats/:blogSlug
exports.getCommentStats = async (req, res) => {
  try {
    const { blogSlug } = req.params;

    const stats = await Comment.aggregate([
      { $match: { blogSlug } },
      {
        $group: {
          _id: null,
          totalComments: { $sum: 1 },
          approvedComments: {
            $sum: { $cond: [{ $and: ["$isApproved", { $not: "$isSpam" }] }, 1, 0] },
          },
          averageRating: { $avg: "$rating" },
          totalReplies: { $sum: { $size: "$replies" } },
        },
      },
    ]);

    res.json({
      success: true,
      message: "Stats retrieved successfully",
      data:
        stats[0] || {
          totalComments: 0,
          approvedComments: 0,
          averageRating: 0,
          totalReplies: 0,
        },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
