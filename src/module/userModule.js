const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (password) {
          // Check for at least one uppercase, one lowercase, one number, and one special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
            password
          );
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    },

    // Location Information
    division: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    upazila: { type: String, required: true, trim: true },
    union: { type: String, trim: true },
    village: { type: String, trim: true },

    // Contact Information
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{11}$/, "Phone number must be 11 digits"],
    },

    // User Role and Status
    role: {
      type: String,
      enum: ["farmer", "expert", "admin", "dealer", "buyer"],
      default: "farmer",
      required: true,
    },
    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
      default: "pending",
    },

    // Profile Information
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (dob) {
          return dob < new Date();
        },
        message: "Date of birth cannot be in the future",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },

    // Agriculture-specific Information
    farmingExperience: {
      type: Number, // Years of experience
      min: [0, "Farming experience cannot be negative"],
      max: [100, "Farming experience seems unrealistic"],
    },
    farmSize: {
      value: { type: Number, min: 0 },
      unit: {
        type: String,
        enum: ["acre", "bigha", "katha", "decimal"],
        default: "decimal",
      },
    },
    primaryCrops: [
      {
        type: String,
        trim: true,
      },
    ],
    farmLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },

    // Verification Status
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false, // Don't include in queries by default
    },
    phoneVerificationCode: {
      type: String,
      select: false,
    },

    // Password Reset
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    // Activity Tracking
    lastLogin: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },

    // Preferences
    language: {
      type: String,
      enum: ["bn", "en"],
      default: "bn",
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },

    // Additional metadata
    registrationSource: {
      type: String,
      enum: ["web", "mobile", "admin"],
      default: "web",
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.phoneVerificationCode;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
  }
);

// Indexes for better performance
usersSchema.index({ email: 1 });
usersSchema.index({ phone: 1 });
usersSchema.index({ division: 1, district: 1, upazila: 1 });
usersSchema.index({ role: 1, accountStatus: 1 });
usersSchema.index({ primaryCrops: 1 });
usersSchema.index({ createdAt: -1 });

// Pre-save hook for password hashing
usersSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
usersSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate password reset token
usersSchema.methods.createPasswordResetToken = function () {
  const resetToken = require("crypto").randomBytes(32).toString("hex");

  this.passwordResetToken = require("crypto")
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Static method to find users by location
usersSchema.statics.findByLocation = function (division, district, upazila) {
  return this.find({
    division: new RegExp(division, "i"),
    district: new RegExp(district, "i"),
    upazila: new RegExp(upazila, "i"),
  });
};

// Virtual for full name display
usersSchema.virtual("fullLocation").get(function () {
  return `${
    this.village ? this.village + ", " : ""
  }${this.upazila}, ${this.district}, ${this.division}`;
});

module.exports = mongoose.model("Users", usersSchema);
