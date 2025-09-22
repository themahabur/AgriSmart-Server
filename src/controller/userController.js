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

exports.getUser = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("=== LOGIN REQUEST START ===");
    console.log("Request body:", req.body);

    const { email, password } = req.body;
    console.log("Extracted email:", email);
    console.log("Extracted password:", password);

    const user = await Users.findOne({ email: email });
    console.log("Found user:", user);

    if (user) {
      console.log("User ID:", user._id);
      console.log("User name:", user.name);
      console.log("User email:", user.email);
      console.log("User district:", user.district);
      console.log("User phone:", user.phone);
      console.log("Stored password hash:", user.password);
    } else {
      console.log("No user found with this email");
    }

    console.log("=== LOGIN REQUEST END ===");

    res
      .status(200)
      .json({ message: "Login console test completed", foundUser: !!user });
  } catch (error) {
    console.log("Login error:", error.message);
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }
};
