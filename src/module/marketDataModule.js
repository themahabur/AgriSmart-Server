const mongoose = require("mongoose");

const marketDataSchema = new mongoose.Schema(
  {
    // Unique date identifier for the market data
    dataDate: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Today's market data array
    todayMarketData: [
      {
        price_date: {
          type: String,
          required: true,
        },
        commodity_id: {
          type: Number,
          required: true,
        },
        a_r_lowestPrice: {
          type: String,
          default: null,
        },
        a_r_howestPrice: {
          type: String,
          default: null,
        },
        a_w_lowestPrice: {
          type: String,
          default: null,
        },
        a_w_howestPrice: {
          type: String,
          default: null,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        nameEn: {
          type: String,
          required: true,
          trim: true,
        },
        nameBn: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    // Previous market data array
    preMarketData: [
      {
        price_date: {
          type: String,
          required: true,
        },
        commodity_id: {
          type: Number,
          required: true,
        },
        a_r_lowestPrice: {
          type: String,
          default: null,
        },
        a_r_howestPrice: {
          type: String,
          default: null,
        },
        a_w_lowestPrice: {
          type: String,
          default: null,
        },
        a_w_howestPrice: {
          type: String,
          default: null,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        nameEn: {
          type: String,
          required: true,
          trim: true,
        },
        nameBn: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    // Metadata for tracking
    fetchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    dataSource: {
      type: String,
      default: "External API",
    },
    totalTodayItems: {
      type: Number,
      default: 0,
    },
    totalPreItems: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Add compound index for better query performance
marketDataSchema.index({ dataDate: 1, fetchedAt: -1 });

module.exports = mongoose.model("MarketData", marketDataSchema);
