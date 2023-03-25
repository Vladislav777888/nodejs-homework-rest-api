const express = require("express");
const authRouter = express.Router();

const { authMiddlewares } = require("../../middlewares");

const { authController } = require("../../controllers");

authRouter
  .route("/register")
  .post(authMiddlewares.checkUserRegister, authController.registerUser);
authRouter
  .route("/login")
  .post(authMiddlewares.checkUserLogin, authController.loginUser);
authRouter
  .route("/logout")
  .post(authMiddlewares.checkUserLogout, authController.logoutUser);
authRouter
  .route("/current")
  .get(authMiddlewares.checkCurrentUser, authController.currentUser);

// authRouter.use(protectRoute);

authRouter
  .route("/")
  .patch(
    [authMiddlewares.checkCurrentUser, authMiddlewares.checkUserSubscription],
    authController.updateUserSubscription
  );

module.exports = authRouter;
