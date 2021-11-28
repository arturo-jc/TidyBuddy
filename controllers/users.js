const { serializeUser } = require("passport");
const { User } = require("../models/user")
const { Household } = require("../models/household")

module.exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const user = await User.register(newUser, password);
    res.redirect("/households/choose");
}

module.exports.redirectUser = async (req, res) => {
    const household = await Household.findOne({ users: req.user });
    if (household) {
        return res.redirect(`/households/${household._id}`);
    }
    res.redirect("/households/choose");
}