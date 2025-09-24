const Users = require('../module/userModule');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, division, district, upazila, phone } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !division ||
      !district ||
      !upazila ||
      !phone
    ) {
      return res
        .status(400)
        .json({ status: false, message: 'All fields are required' });
    }

    const exists = await Users.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ status: false, message: 'Email already registered' });
    }

    const existsPhone = await Users.findOne({ phone });
    if (existsPhone) {
      return res
        .status(400)
        .json({ status: false, message: 'phone already registered' });
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

    res.status(201).json({
      status: true,
      message: [
        { message: 'Login successful' },
        { message: 'নিশ্চিন্তে থাকো রেজিস্টার হয়ে গেছে বৎস !😴' },
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};
