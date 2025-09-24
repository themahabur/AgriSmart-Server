const Users = require('../module/userModule');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: 'Email and password are required' });
    }

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

    res.status(200).json({
      status: true,
      message: [
        { message: 'Login successful' },
        { message: 'হালকা মুতে শুতে যাও লগইন হয়ে গেছে !😴' },
      ],
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};
