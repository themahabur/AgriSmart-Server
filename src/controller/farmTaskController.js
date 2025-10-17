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
