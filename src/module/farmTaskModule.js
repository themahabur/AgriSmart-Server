const mongoose = require("mongoose");

const farmTaskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  des: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"], // optional: restricts values
    default: "medium",
  },
  status: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress",
  },
  farmName: {
    type: String,
    trim: true,
  },
});

// Create and export the model
module.exports = mongoose.model("FarmTask", farmTaskSchema);
