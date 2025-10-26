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
