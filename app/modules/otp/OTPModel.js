const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const { SALT_WORK_FACTOR } = require("../../comman/config");
const ObjectId = mongoose.Schema.Types.ObjectId;
const OTPSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      // ref: "User",
      require: true,
      unique: true,
    },
    otp: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
OTPSchema.pre("save", async function save(next) {
  if (!this.isModified("otp")) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.otp = await bcrypt.hash(this.otp, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const OTPModel = mongoose.model("OTP", OTPSchema);
module.exports = OTPModel;
