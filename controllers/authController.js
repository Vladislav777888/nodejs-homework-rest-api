const { catchAsync } = require("../utils");
const { authService, ImageService } = require("../services");
const { AppError } = require("../utils");

exports.registerUser = catchAsync(async (req, res, next) => {
  const { email, subscription, avatarURL } = await authService.register(
    req.body
  );

  res.status(201).json({
    user: {
      email,
      subscription,
      avatarURL,
    },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const user = await authService.login(req.body);

  res.status(200).json({
    token: user.token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

exports.logoutUser = catchAsync(async (req, res, next) => {
  await authService.logout(req.user);

  res.sendStatus(204);
});

exports.currentUser = catchAsync(async (req, res, next) => {
  const { email, subscription } = await authService.current(req.user);

  res.status(200).json({
    email,
    subscription,
  });
});

exports.updateUserSubscription = catchAsync(async (req, res, next) => {
  const { subscription } = req.body;
  const { email } = await authService.updateUserSubscription(
    req.user,
    subscription
  );

  res.status(200).json({
    email,
    subscription,
  });
});

exports.updateUserPhoto = catchAsync(async (req, res, next) => {
  if (req.file === undefined) {
    return next(new AppError(400, "Please upload a photo!"));
  }

  const { user } = req;

  const fileName = await ImageService.save(user, req.file);

  user.avatarURL = fileName;

  const updatedUser = await user.save();

  res.status(200).json({
    avatarURL: updatedUser.avatarURL,
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  await authService.verifyEmail(req.user);

  res.status(200).json({
    message: "Verification successful",
  });
});

exports.verifyEmailAgain = catchAsync(async (req, res, next) => {
  await authService.verifyEmailAgain(req.user);

  res.status(200).json({
    message: "Verification email sent",
  });
});
