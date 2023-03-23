const { catchAsync } = require("../utils");
const { authService } = require("../services");

exports.registerUser = catchAsync(async (req, res, next) => {
  const { email, subscription } = req.body;

  await authService.register(req.body);

  res.status(201).json({
    user: {
      email,
      subscription: subscription || "starter",
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
