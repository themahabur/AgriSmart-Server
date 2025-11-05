const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or 'Expert'
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: String,
      ref: "Conversation",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: 5000,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

module.exports = mongoose.model("Message", messageSchema);
