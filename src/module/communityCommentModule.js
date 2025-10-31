const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content cannot be empty"],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true, // Index for faster lookups of comments by post
    },
  },
  { timestamps: true }
);

const CommunityComment = mongoose.model("CommunityComment", commentSchema);
module.exports = CommunityComment;
