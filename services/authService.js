const { signToken, sendEmail } = require("../utils");
const User = require("../models/authModel");
const uuid = require("uuid").v4;

exports.register = async (body) => {
  const verificationToken = uuid();
  const newUser = await User.create({ ...body, verificationToken });

  const msg = {
    to: body.email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Verify your email</a>`,
  };

  await sendEmail(msg);

  return newUser;
};

exports.login = async (body) => {
  const { email } = body;
  const user = await User.findOne({ email });

  const token = signToken(user._id);

  user.token = token;
  await user.save();

  return user;
};

exports.logout = async (currentUser) => {
  const user = currentUser;

  user.token = null;
  await user.save();
};

exports.current = async (currentUser) => {
  const user = currentUser;

  return user;
};

exports.updateUserSubscription = async (currentUser, body) => {
  const user = currentUser;

  user.subscription = body;
  await user.save();

  return user;
};

exports.verifyEmail = async (data) => {
  const user = data;

  user.verify = true;
  user.verificationToken = "null";

  await user.save();

  return user;
};

exports.verifyEmailAgain = async (data) => {
  const user = data;
  const verificationToken = uuid();

  user.verificationToken = verificationToken;
  await user.save();

  const msg = {
    to: data.email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Verify your email</a>`,
  };

  await sendEmail(msg);

  return user;
};
