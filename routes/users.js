const express = require("express");
const router = express.Router();
const { createUser, redirectUser } = require("../controllers/users")
const { Household } = require("../models/household")
const passport = require("passport");
const catchAsync = require("../utilities/catchAsync");

router.get("/", catchAsync(async (req, res) => {
    if (req.user) {
        const household = await Household.find({ user: req.user });
        return res.redirect(`/households/${household._id}`)
    }
    res.redirect("/login")
}))

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.post("/register", catchAsync(createUser))

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), catchAsync(redirectUser))

module.exports = router;