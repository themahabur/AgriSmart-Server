const CommunityPost = require("../module/CommunityPostModule");
const Comment = require("../module/CommunityCommentModule");

// --- POST CONTROLLERS ---

// @desc    Create a new post
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;
    const author = req.user.id;

    const post = await CommunityPost.create({
      title,
      content,
      image,
      tags,
      author,
    });

    // Populate author details before sending back
    await post.populate("author", "name avatar");

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all posts
// @access  Public
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find({})
      .populate("author", "name avatar") // Attach author's name and avatar
      .sort({ createdAt: -1 }); // Show newest posts first

    res.status(200).json({ success: true, count: posts?.length, data: posts });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ success: false, message: `Server Error ${error}` });
  }
};

// @desc    Get a single post by ID
// @access  Public
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name avatar")
      .populate({
        // This is how you populate nested documents
        path: "comments",
        populate: {
          path: "author",
          select: "name avatar",
        },
      });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a post
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "User not authorized" });
    }
    // Also delete all comments associated with the post
    await Comment.deleteMany({ post: req.params.id });

    await post.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Post and associated comments removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- LIKE CONTROLLER ---

// @desc    Like or Unlike a post
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const index = post.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (index > -1) {
      post.likes.splice(index, 1); // User has liked, so unlike
    } else {
      post.likes.push(userId); // User has not liked, so like
    }

    await post.save();
    res.status(200).json({ success: true, data: post.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- COMMENT CONTROLLER ---

// @desc    Create a new comment on a post
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const author = req.user._id;
    const postId = req.params.postId; // Note: we'll name the param 'postId'

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const comment = await Comment.create({ content, author, post: postId });

    // Add the comment's ID to the post's comments array
    post.comments.push(comment._id);
    await post.save();

    // Populate author details before sending back
    await comment.populate("author", "name avatar");

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
