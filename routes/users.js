const express = require("express");
const router = express.Router();
const { createUser, redirectUser } = require("../controllers/users")
const { Household } = require("../models/household")
const passport = require("passport");
const catchAsync = require("../utilities/catchAsync");

router.get("/", catchAsync(async (req, res) => {
    if (req.user) {
        const household = await Household.findOne({ user: req.user });
        return res.redirect(`/households/${household._id}`)
    }
    res.redirect("/login")
}))

router.route("/login")
    .get((req, res) => res.render("users/login"))
    .post(
        passport.authenticate("local", { failureRedirect: "/login" }),
        catchAsync(redirectUser)
    )

router.route("/register")
    .get((req, res) => res.render("users/register"))
    .post(catchAsync(createUser))

module.exports = router;