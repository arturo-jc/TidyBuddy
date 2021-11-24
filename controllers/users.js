const { serializeUser } = require("passport");
const { User } = require("../models/user")

module.exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const user = await User.register(newUser, password);
    res.redirect("/index");
}

module.exports.loginUser = async (req, res) => {
    res.redirect("/");
}