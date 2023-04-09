const express = require("express");
const authRouter = express.Router();

const { authMiddlewares } = require("../../middlewares");
const { authController } = require("../../controllers");

authRouter
  .route("/register")
  .post(authMiddlewares.checkUserRegister, authController.registerUser);

authRouter
  .route("/verify")
  .post(authMiddlewares.checkVerifyEmailAgain, authController.verifyEmailAgain);

authRouter
  .route("/verify/:verificationToken")
  .get(authMiddlewares.checkVerifyEmail, authController.verifyEmail);

authRouter
  .route("/login")
  .post(authMiddlewares.checkUserLogin, authController.loginUser);

authRouter
  .route("/logout")
  .post(authMiddlewares.checkUserLogout, authController.logoutUser);

authRouter
  .route("/current")
  .get(authMiddlewares.checkCurrentUser, authController.currentUser);

authRouter
  .route("/avatars")
  .patch(
    [authMiddlewares.checkCurrentUser, authMiddlewares.checkUploadUserPhoto],
    authController.updateUserPhoto
  );

authRouter
  .route("/")
  .patch(
    [authMiddlewares.checkCurrentUser, authMiddlewares.checkUserSubscription],
    authController.updateUserSubscription
  );

module.exports = authRouter;
