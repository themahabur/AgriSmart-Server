const mongoose = require("mongoose");

const recentActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activityType: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const RecentActivity = mongoose.model("RecentActivity", recentActivitySchema);

module.exports = RecentActivity;
