const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  // Tên
  name: {
    type: String,
    required: true,
  },

  // Email
  email: {
    type: String,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    required: true,
    unique: true,
    select: false,
  },

  // SĐT
  phoneNumber: {
    type: String,
    //match: /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
    required: true,
    unique: true,
  },

  // Mật khẩu
  password: {
    type: String,
    match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    required: true,
    minlength: [
      8,
      "Password must be at least 8 characters long, one uppercase letter, one lowercase letter, one number and one special character",
    ],
    select: false,
  },

  avatar: {
    public_id: {
      type: String,
      default: "361830248_6399792966771248_2858405288794756845_n_yxes78",
    },
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/ddedeiqus/image/upload/v1689740997/361830248_6399792966771248_2858405288794756845_n_yxes78.png",
    },
  },

  // Ngày sinh
  birth: {
    type: String,
    default: "",
  },

  // Giới tính
  gender: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
  });
};

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("user", userSchema);
