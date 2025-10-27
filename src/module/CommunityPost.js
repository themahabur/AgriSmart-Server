const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    user: {
      name: { type: String, required: true },
      location: { type: String, required: true },
      avatar: { type: String },
      role: { type: String, default: 'member' },
    },

    image: { type: String, default: null },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    isLiked: { type: Boolean, default: false },
    isBookmarked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommunityPost', communityPostSchema);
