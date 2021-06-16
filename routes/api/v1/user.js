const express = require("express");
const router = express.Router();
const passport = require("passport");

//fetch the respective controllers
const usersApi = require("../../../controllers/api/v1/users_api");
const homeController = require("../../../controllers/home_controller");

//route for local user sign up
router.post("/sign-up", usersApi.signUp);

//route for user account verification
router.get("/verify-email/:id", usersApi.verifyAccount);

//route for local user sign in
router.post("/sign-in", usersApi.signIn);

//route for google sign up/in
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/user/sign-up" }),
  usersApi.googleSignIn
);

//route for user sign out
router.get(
  "/sign-out",
  passport.authenticate("jwt", { session: "false" }),
  usersApi.signOut
);

//route for updating user profile
router.post(
  "/update-profile/:id",
  passport.authenticate("jwt", { session: "false" }),
  usersApi.update
);

//route for forgot password
router.post("/forgot-password", usersApi.forgetPassword);

//route for resetting user password
router.post("/reset-password/:id", usersApi.resetPassword);

module.exports = router;
