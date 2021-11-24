const express = require("express");
const { createUser, loginUser } = require("../controllers/users")
const router = express.Router();
const { User } = require("../models/user");
const passport = require("passport");


router.get("/index", async (req, res) => {
    const users = await User.find({})
    res.render("users/index", { users });
})

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.post("/register", createUser)

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), loginUser)

module.exports = router;