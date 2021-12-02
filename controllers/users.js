const { User } = require("../models/user");
const { ActivityType } = require("../models/activity-type");
const { Activity } = require("../models/activity");
const { Comment } = require("../models/comment");
const { Household } = require("../models/household");
const { cloudinary } = require("../cloudinary");
const ExpressError = require("../utilities/ExpressError");

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
    const redirectUrl = req.session.returnTo || "/"
    delete req.session.returnTo
    return res.redirect(redirectUrl)
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

module.exports.serveChangePasswordForm = async (req, res) => {
    const {userId} = req.params;
    const user = await User.findById(userId);
    res.render("users/change-password", {user})
}

module.exports.changePassword = async (req, res, next) => {
    const {userId} = req.params;
    const {currentpw, reenter, newpw} = req.body;
    if (currentpw !== reenter) {
        return next(new ExpressError("Passwords do not match, please try again", 403, "IncorrectPasswordError"))
    }
    const user = await User.findById(userId);
    await user.changePassword(currentpw, newpw);
    req.flash("success", "Password successfully changed.")
    res.redirect(`/users/${userId}/change-password`);
}

module.exports.serveDeleteForm = async (req, res) =>{
    const {userId} = req.params;
    const user = await User.findById(userId);
    res.render("users/delete-account", {user})
}

module.exports.deleteAccount = async (req, res) => {
    const {userId} = req.params;
    const {password} = req.body;

    // Find user and populate for Cloudinary purposes
    const user = await User.findById(userId)
    .populate({
        path: "profilePic",
        populate: "filename"
    })

    // Authenticate user
    await user.authenticate(password)

    // Delete user reference from households
    await Household.updateMany({users: user}, {$pull: { users: user._id }})

    // Delete all user activities
    await Activity.deleteMany({user})

    // Delete all user comments and their references from their respective activities
    const comments = await Comment.find({user})
    await Activity.updateMany({comments: {$in: comments}}, {$pull: {comments: {$in: comments}}})
    await Comment.deleteMany({user})
    
    // Tell Cloudinary to delete profile pic if user has one
    if (user.profilePic) {
        await cloudinary.uploader.destroy(user.profilePic.filename)
    }

    // Delete all activity types within empty households
    const emptyHouseholds = await Household.find({users: {$eq: []}});
    if (emptyHouseholds){
        for (let household of emptyHouseholds){
            await ActivityType.deleteMany({_id: {$in: household.activityTypes}})
        }
    }

    // Delete all empty households
    await Household.deleteMany({users: {$eq: []}})

    // Delete user
    await User.findByIdAndDelete(userId)

    req.flash("success", "Account deleted.")
    res.redirect("/login")
}