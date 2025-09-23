const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: {
      type: String,
      required: true,
      minlength: 6,
      set: v => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    district: { type: String, required: true },
    upazila: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{11}$/,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Users', usersSchema);
