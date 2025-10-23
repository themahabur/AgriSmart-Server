const Farm = require("../module/farmModule");

exports.getUserDashboard = async (req, res) => {
  const email = req.params.email;
  try {
    const farmCount = await Farm.countDocuments({ userEmail: email });
  } catch (error) {}
};
