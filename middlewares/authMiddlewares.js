const jwt = require("jsonwebtoken");

const User = require("../models/authModel");
const { ImageService } = require("../services");
const { AppError, catchAsync, authValidator } = require("../utils");

exports.checkUserRegister = catchAsync(async (req, res, next) => {
  const { error, value } = authValidator.registerValidator(req.body);

  if (error) {
    return next(new AppError(400, error.details[0].message));
  }

  const userExists = await User.exists({ email: value.email });

  if (userExists) return next(new AppError(409, "Email in use"));

  req.body = value;

  next();
});

exports.checkUserLogin = catchAsync(async (req, res, next) => {
  const { error, value } = authValidator.loginValidator(req.body);

  const user = await User.findOne({
    email: value.email,
  });

  if (error) {
    return next(new AppError(400, error.details[0].message));
  }

  if (!user || !user.verify) {
    return next(new AppError(401, "Email or password or verify is wrong"));
  }

  const correctPassword = await user.checkPassword(
    value.password,
    user.password
  );

  if (!correctPassword) {
    return next(new AppError(401, "Email or password is wrong"));
  }

  req.body = value;

  next();
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) return next(new AppError(401, "Not authorized"));

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err.message);

    return next(new AppError(401, "Not authorized"));
  }

  const currentUser = await User.findOne({ _id: decodedToken.id, token });

  if (!currentUser) return next(new AppError(401, "Not authorized"));

  req.user = currentUser;

  next();
});

exports.checkCurrentUser = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) return next(new AppError(401, "Not authorized"));

  const currentUser = await User.findOne({ token });

  if (!currentUser) return next(new AppError(401, "Not authorized"));

  req.user = currentUser;

  next();
});

exports.checkUserLogout = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) return next(new AppError(401, "Not authorized"));

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err.message);

    return next(new AppError(401, "Not authorized"));
  }

  const currentUser = await User.findOne({ _id: decodedToken.id, token });

  if (!currentUser) return next(new AppError(401, "Not authorized"));

  req.user = currentUser;

  next();
});

exports.checkUserSubscription = catchAsync(async (req, res, next) => {
  const { error, value } = authValidator.updateUserSubscriptionValidator(
    req.body
  );

  if (error) {
    return next(new AppError(400, error.details[0].message));
  }

  req.body = value;

  next();
});

exports.checkVerifyEmail = catchAsync(async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    return next(new AppError(404, "User not found"));
  }

  req.user = user;

  next();
});

exports.checkVerifyEmailAgain = catchAsync(async (req, res, next) => {
  const { error, value } = authValidator.verifyEmailAgainValidator(req.body);
  const user = await User.findOne({ email: value.email, verify: false });

  if (error) {
    return next(new AppError(400, "missing required field email"));
  }

  if (!user) {
    return next(new AppError(400, "Verification has already been passed"));
  }

  req.user = user;

  next();
});

exports.checkUploadUserPhoto = ImageService.upload("avatar");
