const CommunityPost = require('../module/CommunityPost');

const createPost = async (req, res) => {
  try {
    const { title, description, user, image, tags } = req.body;

    if (!user || !user.name || !user.location || !user.avatar) {
      return res.status(400).json({
        success: false,
        message: 'User object missing required fields',
      });
    }

    const newPost = await CommunityPost.create({
      title,
      description,
      user,
      image,
      tags,
    });

    res.status(201).json({
      success: true,
      message: 'Post Created Successfully',
      data: newPost,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single post
const getSinglePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
};
