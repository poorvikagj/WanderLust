const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectURL, isLoggedIn } = require("../middleware");
const userController = require("../controllers/user.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup))


router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectURL, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.login);

router.get("/logout", userController.logout);

module.exports = router;