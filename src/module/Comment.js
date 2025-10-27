const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    blogSlug: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer",
      },
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
    isSpam: {
      type: Boolean,
      default: false,
    },
    userIP: String,
    userAgent: String,
    replies: [
      {
        name: { type: String, required: true, trim: true, maxlength: 100 },
        email: { type: String, required: true, trim: true, lowercase: true },
        comment: { type: String, required: true, trim: true, minlength: 1, maxlength: 500 },
        isApproved: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

commentSchema.index({ blogSlug: 1, isApproved: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
