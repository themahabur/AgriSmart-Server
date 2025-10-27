const Users = require("../module/userModule");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { handleError } = require("../utils/errorHandler");
const RecentActivity = require("../module/recentActivityModule");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: 'Incorrect password' });
    }

    const tokenPayload = { id: user._id, email: user.email };
    const token = generateToken(tokenPayload);

    // Record recent activity
    await RecentActivity.create({
      user: user._id,
      activityType: "user_login",
      details: "User logged in",
    });

    res.status(200).json({
      status: true,
      message: [
        { message: "Login successful" },
        { message: "হালকা মুতে শুতে যাও লগইন হয়ে গেছে !😴" },
      ],
      token,
    });
  } catch (error) {
    return handleError(error, res);
  }
};
