const mongoose = require("mongoose");

const knowledgeHubSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      required: true,
      enum: ["blog", "article", "guide", "news", "video"],
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Crop Management",
        "Irrigation",
        "Pest Control",
        "Soil Health",
        "Weather",
        "Technology",
        "Market Insights",
        "Sustainability",
      ],
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
    },
    media: {
      type: String,
      trim: true,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["pending", "draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    author: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Add compound indexes for better query performance
knowledgeHubSchema.index({ status: 1, category: 1, createdAt: -1 });
knowledgeHubSchema.index({ tags: 1, status: 1 });
knowledgeHubSchema.index({ "author.email": 1, status: 1 });

// Pre-save middleware to set publishedAt when status changes to published
knowledgeHubSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("KnowledgeHub", knowledgeHubSchema);
