const Users = require("../module/userModule");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, district, upazila, phone } = req.body;

    if (!name || !email || !password || !district || !upazila || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new Users({
      name,
      email,
      password,
      district,
      upazila,
      phone,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};
