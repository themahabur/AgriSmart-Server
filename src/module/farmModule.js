const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Farm name must be at least 2 characters"],
      maxlength: [100, "Farm name cannot exceed 100 characters"],
    },
    location: {
      type: String,
      trim: true,
      default: null,
    },
    sizeAcre: {
      type: Number,
      min: 0,
      default: null,
    },
    crop: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      trim: true,
      default: "পরিকল্পনাধীন",
    },

    // Geolocation
    coordinates: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },

    // Crop details
    cropDetails: {
      type: new mongoose.Schema(
        {
          type: { type: String, trim: true, default: null },
          variety: { type: String, trim: true, default: null },
          plantingDate: { type: Date, default: null },
        },
        { _id: false }
      ),
      default: {},
    },

    // Soil details
    soilDetails: {
      type: new mongoose.Schema(
        {
          type: { type: String, trim: true, default: null },
          pH: { type: Number, min: 0, max: 14, default: null },
          nutrients: { type: String, trim: true, default: null },
        },
        { _id: false }
      ),
      default: {},
    },

    // Irrigation info
    irrigation: {
      type: new mongoose.Schema(
        {
          source: { type: String, trim: true, default: null },
          lastDate: { type: Date, default: null },
          tubeWellDepth: { type: Number, min: 0, default: null }, // ✅ new field
        },
        { _id: false }
      ),
      default: {},
    },

    // Alerts & practices
    pestAlert: { type: Boolean, default: false },
    organicPractices: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Normalize id field and hide __v
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Helpful indexes
farmSchema.index({ userEmail: 1, createdAt: -1 });
farmSchema.index({ crop: 1 });
farmSchema.index({ status: 1 });

module.exports = mongoose.model("Farm", farmSchema);