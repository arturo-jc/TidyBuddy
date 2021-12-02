const express = require("express");
const router = express.Router();
const { createUser, redirectUponLogin, updateProfilePic, showUserProfile, takeUserToMain, serveChangePasswordForm, changePassword, serveDeleteForm, deleteAccount } = require("../controllers/users")
const passport = require("passport");
const catchAsync = require("../utilities/catchAsync");
const catchAsyncFlash = require("../utilities/catchAsyncFlash");
const { isLoggedIn, ownsAccount } = require("../middleware")
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary")
const upload = multer({ storage });

router.get("/", catchAsync(takeUserToMain))

router.route("/login")
    .get((req, res) => res.render("users/login"))
    .post(
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
        catchAsync(redirectUponLogin)
    )

router.get("/logout", (req, res) => {
    req.flash("success", "Come back soon!")
    req.logout();
    res.redirect("/login")
})

router.route("/register")
    .get((req, res) => res.render("users/register"))
    .post(catchAsyncFlash(createUser))

router.get("/users/:userId", isLoggedIn, catchAsync(showUserProfile))

router.route("/users/:userId/change-password")
    .get(isLoggedIn, catchAsync(ownsAccount), catchAsync(serveChangePasswordForm))
    .put(isLoggedIn, catchAsync(ownsAccount), catchAsync(changePassword))

router.get("/users/:userId/delete-account", isLoggedIn, catchAsync(ownsAccount), catchAsync(serveDeleteForm))

router.put("/users/:userId/profile-pic", catchAsync(ownsAccount), upload.single("profile-pic"), catchAsync(updateProfilePic))

router.delete("/users/:userId", isLoggedIn, catchAsync(ownsAccount), catchAsync(deleteAccount))

module.exports = router;