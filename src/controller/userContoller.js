const Users = require("../module/userModule");
const { handleError } = require("../utils/errorHandler");

// Get current user's data
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Users.findById(userId)
      .select
      // "-password -emailVerificationToken -phoneVerificationCode -passwordResetToken -passwordResetExpires"
      ();

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

// get user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await Users.findOne({ email }).select(
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

// Get user by ID (admin only or public profile)
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Basic user info for public profile
    const user = await Users.findById(userId).select(
      "name email role division district upazila farmingExperience primaryCrops farmSize accountStatus createdAt avatar bio"
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

// Get all users (admin only with pagination and filtering)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.accountStatus) filter.accountStatus = req.query.accountStatus;
    if (req.query.division)
      filter.division = new RegExp(req.query.division, "i");
    if (req.query.district)
      filter.district = new RegExp(req.query.district, "i");

    const users = await Users.find(filter)
      .select(
        "name email avatar role division district upazila accountStatus createdAt lastLogin"
      )
      .sort({ createdAt: -1 });
    // .skip(skip)
    // .limit(limit);

    const totalUsers = await Users.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      status: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// Update user profile (only for the user themselves)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = req.body;

    const user = await Users.findByIdAndUpdate(userId, userData, { new: true });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User profile updated successfully",
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
      //   accountStatus: "active",
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
