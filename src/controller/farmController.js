const Farm = require("../module/farmModule");
const { handleError } = require("../utils/errorHandler");

// GET /api/farms
exports.listFarms = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [farms, total] = await Promise.all([
      Farm.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Farm.countDocuments({ user: userId }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      status: true,
      message: "Farms retrieved successfully",
      data: {
        farms,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// POST /api/farms
exports.createFarm = async (req, res) => {
  try {
    const userId = req.user.id;

    const payload = sanitizeFarmPayload(req.body);
    payload.user = userId;

    const farm = await Farm.create(payload);

    return res.status(201).json({
      status: true,
      message: "Farm created successfully",
      data: farm,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// GET /api/farms/:id
// Get a single farm (owner only)
exports.getFarmById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const farm = await Farm.findOne({ _id: id, user: userId });
    if (!farm) {
      return res.status(404).json({
        status: false,
        message: "Farm not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Farm retrieved successfully",
      data: farm,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// PUT /api/farms/:id
// Update a farm (owner only)
exports.updateFarm = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const updates = sanitizeFarmPayload(req.body, { partial: true });

    const farm = await Farm.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!farm) {
      return res.status(404).json({
        status: false,
        message: "Farm not found or not authorized",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Farm updated successfully",
      data: farm,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// DELETE /api/farms/:id
exports.deleteFarm = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const farm = await Farm.findOneAndDelete({ _id: id, user: userId });
    if (!farm) {
      return res.status(404).json({
        status: false,
        message: "Farm not found or not authorized",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Farm deleted successfully",
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// Build a safe payload from incoming body to prevent unwanted field injection
function sanitizeFarmPayload(body, options = {}) {
  const allow = {
    name: true,
    location: true,
    size: true,
    crop: true,
    status: true,
    coordinates: true,
    cropDetails: true,
    soilDetails: true,
    irrigation: true,
    pestAlert: true,
    organicPractices: true,
  };

  const result = {};
  Object.keys(allow).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      result[key] = body[key];
    }
  });
  return result;
}


