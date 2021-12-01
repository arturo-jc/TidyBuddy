const { User } = require("../models/user")
const { Household } = require("../models/household")
const { cloudinary } = require("../cloudinary")


module.exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const user = await User.register(newUser, password);
    req.login(user, err => {
        if (err) return next(err);
        res.redirect("/households/find-or-create")
    });
}

module.exports.redirectUponLogin = async (req, res) => {
    const household = await Household.findOne({ users: req.user });
    if (household) {
        return res.redirect(`/households/${household._id}`);
    }
    res.redirect("/households/find-or-create");
}

module.exports.updateProfilePic = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                profilePic: {
                    url: req.file.path,
                    filename: req.file.filename
                }
            }
        }
    ).populate({
        path: "profilePic",
        populate: "filename"
    })

    // if user had a previous profile pic, tell Cloudinary to delete it from their db
    // (Recall that Model.findByIdAndUpdate returns previous version of doc (prior to update))

    if (user.profilePic) {
        await cloudinary.uploader.destroy(user.profilePic.filename)
    }

    req.flash("success", "Profile pic updated.")
    res.redirect(`/users/${user._id}`)
}

module.exports.showUserProfile = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.render("users/show", { user })
}

module.exports.takeUserToMain = async (req, res) => {
    if (req.user) {
        const household = await Household.findOne({ users: req.user })
        if (household) {
            return res.redirect(`/households/${household._id}`)
        }
        return res.redirect("/households/find-or-create")
    }
    res.redirect("/login")
}