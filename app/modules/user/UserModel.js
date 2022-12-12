const mongoose = require("mongoose");
const { Schema } = mongoose;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const { SALT_WORK_FACTOR } = require("../../comman/config");
const UserSchema = new Schema({
  email: {
    type: String,
    require: true,
    validate: [isEmail, "Enter a valid Email"],
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  phoneNo: {
    type: Number,
    maxLen: 11,
    require: true,
  },
  countryCode: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter a Valid Password"],
  },
});
// UserSchema.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } )
UserSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
