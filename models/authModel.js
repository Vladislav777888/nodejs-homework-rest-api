const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { enums } = require("../constants");

const authScheme = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: Object.values(enums.USER_SUBSCRIPTION_ENUM),
    default: enums.USER_SUBSCRIPTION_ENUM.STARTER,
  },
  token: {
    type: String,
    default: null,
  },
});

authScheme.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

authScheme.methods.checkPassword = (candidate, hash) =>
  bcrypt.compare(candidate, hash);

const User = model("users", authScheme);

module.exports = User;
