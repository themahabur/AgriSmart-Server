const Users = require("../module/userModule");
const { handleError } = require("../utils/errorHandler");
const RecentActivity = require("../module/recentActivityModule");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, division, district, upazila, phone } =
      req.body;

    const exists = await Users.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ status: false, message: "Email already registered" });
    }

    const existsPhone = await Users.findOne({ phone });
    if (existsPhone) {
      return res
        .status(400)
        .json({ status: false, message: "phone already registered" });
    }

    const newUser = new Users({
      name,
      email,
      password,
      division,
      district,
      upazila,
      phone,
    });
    await newUser.save();

    // Record recent activity
    await RecentActivity.create({
      user: newUser._id,
      activityType: "user_register",
      details: "User registered",
    });

    res.status(201).json({
      status: true,
      message: [
        { message: "Login successful" },
        { message: "নিশ্চিন্তে থাকো রেজিস্টার হয়ে গেছে বৎস !😴" },
      ],
    });
  } catch (error) {
    return handleError(error, res);
  }
};

exports.googleRegister = async (req, res) => {
  try {
    const { email, name, image, googleId } = req.body;

    // Find or create user
    let user = await Users.findOne({ email });

    if (user) {
      // Update existing user
      user.lastLogin = new Date();
      user.loginCount += 1;
      if (!user.googleId) user.googleId = googleId;
      if (!user.avatar) user.avatar = image;
      await user.save();
    } else {
      // Create new OAuth user
      user = await Users.create({
        name,
        email,
        avatar: image,
        googleId,
        authProvider: "google",
        emailVerified: true,
        accountStatus: "active",
      });
    }

    res.json({
      success: true,
      user,
      needsProfileCompletion: !user.profileCompleted,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
