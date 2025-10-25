const RecentActivity = require("../module/recentActivityModule");

const getRecentActivities = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const activities = await RecentActivity.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(20);
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecentActivities };
