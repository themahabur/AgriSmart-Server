const Farm = require("../module/farmModule");
const { handleError } = require("../utils/errorHandler");

// GET /api/farms
exports.listFarms = async (req, res) => {
  const email = req.params.email;

  try {
    const filter = email ? { userEmail: email } : {};
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [farms, total] = await Promise.all([
      Farm.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Farm.countDocuments(),
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
    const payload = sanitizeFarmPayload(req.body);
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
exports.getFarmById = async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findById(id);

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
exports.updateFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = sanitizeFarmPayload(req.body, { partial: true });

    const farm = await Farm.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!farm) {
      return res.status(404).json({
        status: false,
        message: "Farm not found",
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
    const { id } = req.params;
    const farm = await Farm.findByIdAndDelete(id);

    if (!farm) {
      return res.status(404).json({
        status: false,
        message: "Farm not found",
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

// Sanitize payload
function sanitizeFarmPayload(body, options = {}) {
  const allow = {
    userEmail: true,
    name: true,
    location: true,
    sizeAcre: true,
    crop: true,
    status: true,
    coordinates: true,
    cropDetails: true,
    soilDetails: true,
    irrigation: true,
    pestAlert: true,
    organicPractices: true,
    harvestSummary: true,
  };

  const result = {};
  Object.keys(allow).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      result[key] = body[key];
    }
  });
  return result;
}
