const farmTask = require("../module/farmTaskModule");

// Create a new task
exports.createFarmTask = async (req, res) => {
  try {
    const { email, title, des, date, priority, status, farmName } = req.body;

    // Basic validation
    if (!email || !title) {
      return res.status(400).json({ message: "Email and title are required." });
    }

    // Create a new task
    const newTask = new farmTask({
      email,
      title,
      des,
      date,
      priority,
      status,
      farmName,
    });

    // Save to MongoDB
    const savedTask = await newTask.save();

    res.status(201).json({
      message: "Task created successfully!",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "Server error while creating task.",
      error: error.message,
    });
  }
};

//  Get all tasks by user email
exports.getTasksByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Find all tasks that match the email
    const tasks = await farmTask.find({ email });

    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for this email." });
    }

    res.status(200).json({
      message: "Tasks fetched successfully.",
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      message: "Server error while fetching tasks.",
      error: error.message,
    });
  }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      des,
      date,
      priority,
      status = "completed",
      farmName,
    } = req.body;

    const updatedTask = await farmTask.findByIdAndUpdate(
      id,
      { title, des, date, priority, status, farmName },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      message: "Server error while updating task.",
      error: error.message,
    });
  }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await farmTask.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      message: "Server error while deleting task.",
      error: error.message,
    });
  }
};
