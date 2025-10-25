const RecentActivity = require("../module/recentActivityModule");

const activityMessages = {
  farm_create: (body) => `New farm created: ${body.name}`,
  farm_update: (body) => `Farm updated: ${body.name}`,
  farm_delete: () => `Farm deleted`,
  task_create: (body) => `New task created: ${body.title}`,
  task_update: (body) => `Task updated: ${body.title}`,
  task_delete: () => `Task deleted`,
};

const recordActivity = (activityType) => {
  console.log("recordActivity", activityType);
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        console.warn("recordActivity: Missing user ID");
        return next();
      }

      const getMessage = activityMessages[activityType];
      if (!getMessage) {
        console.warn(`recordActivity: Unknown activity type "${activityType}"`);
        return next();
      }

      const details = getMessage(req.body);

      await RecentActivity.create({
        user: userId,
        activityType,
        details,
      });

      console.info(
        `recordActivity: Logged "${activityType}" for user ${userId}`
      );
      next();
    } catch (error) {
      console.error("recordActivity error:", error);
      next(error);
    }
  };
};

module.exports = recordActivity;
