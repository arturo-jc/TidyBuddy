const express = require("express");
const router = express.Router();
const { createUser, redirectUponLogin, updateProfilePic, showUserProfile, takeUserToMain } = require("../controllers/users")
const { Household } = require("../models/household")
const passport = require("passport");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, ownsAccount } = require("../middleware")
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary")
const upload = multer({ storage });

router.get("/", catchAsync(takeUserToMain))

router.route("/login")
    .get((req, res) => res.render("users/login"))
    .post(
        passport.authenticate("local", { failureRedirect: "/login" }),
        catchAsync(redirectUponLogin)
    )

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/")
})

router.route("/register")
    .get((req, res) => res.render("users/register"))
    .post(catchAsync(createUser))

router.get("/users/:userId", isLoggedIn, catchAsync(showUserProfile))

router.put("/users/:userId/profile-pic", isLoggedIn, ownsAccount, upload.single("profile-pic"), catchAsync(updateProfilePic))

module.exports = router;