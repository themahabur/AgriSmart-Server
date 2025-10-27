const Farm = require("../module/farmModule");
const farmTask = require("../module/farmTaskModule");

exports.getUserDashboard = async (req, res) => {
  const email = req.params.email;
  try {
    const farmCount = await Farm.countDocuments({ userEmail: email });
    const taskCount = await farmTask.countDocuments({ email: email });

    res.status(200).json({
      farmCount,
      taskCount,
    });
    // console.log("farm count", farmCount, "task count", taskCount);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};
