const CommunityPost = require("../module/CommunityPost");

const createPost = async (req, res) => {
  try {
    const { title, description, image, tags, user } = req.body;

    const post = new CommunityPost({
      title,
      description,
      image,
      tags,
      user,
    });

    const createdPost = await post.save();
    // We need to populate the author info for the response to be consistent
    await createdPost.populate("user", "name avatar");

    res.status(201).json({ success: true, data: createdPost });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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
        .json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    // Assuming your auth middleware attaches the user object with an _id
    const userId = req.user.id;

    console.log("User ID:", userId);

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // --- THIS IS THE FIX ---
    // First, check if post.likes is an array. If not, it's old data.
    if (!Array.isArray(post.likes)) {
      // Initialize it as a new array. Now the rest of the code will work.
      post.likes = [];
    }
    // --- END OF FIX ---

    // Now we can safely call array methods on post.likes
    const index = post.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (index > -1) {
      // Already liked, so unlike it (pull)
      post.likes.splice(index, 1);
    } else {
      // Not liked, so like it (push)
      post.likes.push(userId);
    }

    await post.save();

    // Return the updated array of likes
    res.status(200).json({ success: true, data: post.likes });
  } catch (error) {
    console.error("Like Post Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  likePost,
};
