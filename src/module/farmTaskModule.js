import mongoose from "mongoose";

const farmTaskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
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
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  farmName: {
    type: String,
    trim: true,
  },
});

// Create and export the model
const farmTask = mongoose.model("FarmTask", farmTaskSchema);
export default farmTask;
