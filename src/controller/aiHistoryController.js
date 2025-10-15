const aiHistory = require("../module/aiHistoryModule");

// POST - Create new diagnosis (both ai-diagnosis and image-analysis)
const createHistory = async (req, res) => {
  try {
    const { type } = req.body;

    // Validate type
    if (!type || !["ai-diagnosis", "image-analysis"].includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid or missing type. Must be "ai-diagnosis" or "image-analysis"',
      });
    }

    // Generate unique ID (you can use different method like auto-increment)
    const id = req.body.id || Date.now();

    // Create new diagnosis
    const diagnosis = new aiHistory({
      id,
      type,
      solved: req.body.solved || false,
      timestamp: req.body.timestamp || new Date(),
      ...req.body, // Spread the rest of the fields
    });

    // Save to database
    await diagnosis.save();

    return res.status(201).json({
      success: true,
      message: "Diagnosis created successfully",
      data: diagnosis,
    });
  } catch (error) {
    console.error("Error creating diagnosis:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating History",
    });
  }
};

const getAllAiHistory = async (req, res) => {
  const email = req.query.email;
  try {
    const filter = email ? { email } : {};
    const diagnoses = await aiHistory
      .find({ ...filter })
      .sort({ timestamp: -1 });

    const total = await aiHistory.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: diagnoses,
      total,
    });
  } catch (error) {
    console.error("Error fetching diagnoses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createHistory,
  getAllAiHistory,
};
