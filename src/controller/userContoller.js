const Users = require("../module/userModule");
const { handleError } = require("../utils/errorHandler");

// Get current user's data
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Users.findById(userId).select(
      "-password -emailVerificationToken -phoneVerificationCode -passwordResetToken -passwordResetExpires"
    );

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User data retrieved successfully",
      data: user,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// Search users by name, email, or location
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        status: false,
        message: "Search query is required",
      });
    }

    const searchRegex = new RegExp(query, "i");

    const users = await Users.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { division: searchRegex },
        { district: searchRegex },
        { upazila: searchRegex },
        { primaryCrops: { $in: [searchRegex] } },
      ],
      accountStatus: "active",
    })
      .select("name email role division district upazila primaryCrops avatar")
      .limit(20);

    res.status(200).json({
      status: true,
      message: "Search completed successfully",
      data: users,
    });
  } catch (error) {
    return handleError(error, res);
  }
};
