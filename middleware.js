const { Household } = require("./models/household")
const { Activity } = require("./models/activity")
const { Comment } = require("./models/comment")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in");
        return res.redirect("/login")
    }
    next()
}

module.exports.isHouseholdMember = async (req, res, next) => {
    const { householdId } = req.params;
    const household = await Household.findById(householdId);
    if (!household.users.includes(req.user._id)) {
        req.flash("error", "You do not have permission to do that.")
        return res.redirect("/login")
    }
    next()
}

module.exports.ownsAccount = async (req, res, next) => {
    const { userId } = req.params;
    if (userId !== req.user._id.toString()) {
        req.flash("error", "You do not have permission to do that.")
        return res.redirect("/login")
    }
    next()
}

module.exports.ownsActivity = async (req, res, next) => {
    const { activityId } = req.params;
    const activity = await Activity.findById(activityId);
    if (!activity.user.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that.")
        return res.redirect("/login")
    }
    next()
}

module.exports.ownsComment = async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.user.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that.")
        return res.redirect("/login")
    }
    next()
}

module.exports.isEligibleToJoin = async (req, res, next) => {
    const { householdId } = req.params;
    const household = await Household.findById(householdId);
    if (
        household.users.includes(req.user._id)
        || household.pendingRequests.includes(req.user._id)
        || household.declinedRequests.includes(req.user._id)
    ) {
        req.flash("error", "You cannot request to join this household.")
        return res.redirect("/households/find-or-create")
    }
    next()
}