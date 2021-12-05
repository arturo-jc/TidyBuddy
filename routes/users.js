const express = require("express");
const router = express.Router();
const { createUser, redirectUponLogin, updateProfilePic, showUserProfile, serveChangePasswordForm, changePassword, serveDeleteForm, deleteAccount, findHousehold } = require("../controllers/users")
const passport = require("passport");
const catchAsync = require("../utilities/catchAsync");
const { isUser, userExists, isLoggedIn, ownsAccount, PasswordsMatch } = require("../middleware")
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary")
const upload = multer({ storage });

router.get("/", isUser, catchAsync(findHousehold))

router.route("/login")
    .get((req, res) => res.render("users/login"))
    .post(
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
        redirectUponLogin, catchAsync(findHousehold)
    )

router.get("/logout", (req, res) => {
    req.flash("success", "Come back soon!")
    req.logout();
    res.redirect("/login")
})

router.route("/register")
    .get((req, res) => res.render("users/register"))
    .post(catchAsync(createUser))

router.route("/users/:userId")
    .get(isLoggedIn, catchAsync(userExists), catchAsync(showUserProfile))
    .delete(isLoggedIn, catchAsync(ownsAccount), catchAsync(deleteAccount))

router.route("/users/:userId/change-password")
    .get(isLoggedIn, catchAsync(ownsAccount), catchAsync(serveChangePasswordForm))
    .put(isLoggedIn, catchAsync(ownsAccount), PasswordsMatch, catchAsync(changePassword))

router.get("/users/:userId/delete-account", isLoggedIn, catchAsync(ownsAccount), catchAsync(serveDeleteForm))

router.put("/users/:userId/profile-pic", catchAsync(ownsAccount), upload.single("profile-pic"), catchAsync(updateProfilePic))

module.exports = router;