const mongoose = require("mongoose");

const aiHistorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["ai-diagnosis", "image-analysis"],
    },
    solved: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },

    email: {
      type: String,
    },

    // Common/Shared fields that work for both types
    question: String,
    description: String,

    answer: String,
    analysis: String,

    // AI Diagnosis specific fields
    cropType: String,
    symptomArea: String,
    severity: String,
    duration: String,

    // Image Analysis specific fields
    imageUrl: String,
    imagePreview: {
      type: String,
      default: null,
    },
    prompt: String,
    promptType: String,
  },
  {
    timestamps: true,
  }
);

// Create indexes
aiHistorySchema.index({ type: 1 });
aiHistorySchema.index({ solved: 1 });
aiHistorySchema.index({ timestamp: -1 });

const aiHistory = mongoose.model("Diagnosis", aiHistorySchema);

module.exports = aiHistory;
