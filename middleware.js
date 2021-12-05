const Household = require("./models/household")
const User = require("./models/user")
const Activity = require("./models/activity")
const Comment = require("./models/comment")
const ExpressError = require("./utilities/ExpressError");

module.exports.isUser = (req, res, next) => {
    if (!req.isAuthenticated()){
        return res.render("landing")
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        return next(new ExpressError("You must be logged in", 403, "AuthenticationError"))
    }
    next()
}

module.exports.PasswordsMatch = (req, res, next) => {
    const {currentpw, reenter} = req.body;
    if (currentpw !== reenter) {
        return next(new ExpressError("Passwords do not match, please try again", 403, "IncorrectPasswordError"))
    }
    next()
}

// ASYNC

module.exports.householdExists = async (req, res, next) => {
    const {householdId} = req.params;
    if (householdId){
        const household = await Household.findById(householdId)
        if (!household){
            next(new ExpressError(`Sorry, there is no household with ID ${householdId}`, 404, "HouseholdNotFoundErrorRender"))
        }
    }
    const queryHouseholdId = req.query.householdId;
    if (queryHouseholdId){
        const queryHousehold = await Household.findById(queryHouseholdId)
        if (!queryHousehold){
            next(new ExpressError(`Sorry, there is no household with ID ${queryHouseholdId}`, 404, "HouseholdNotFoundErrorFlash"))
        }
    }
    next()
}

module.exports.userExists = async (req, res, next) => {
    const {userId} = req.params;
    const user = await User.findById(userId)
    if (!user){
        next(new ExpressError(`Sorry, there is no user with ID ${userId}`, 404, "NotFoundError"))
    }
    next()
}

module.exports.isHouseholdMember = async (req, res, next) => {
    const { householdId } = req.params;
    const household = await Household.findById(householdId);
    if (!household.users.includes(req.user._id)) {
        return next(new ExpressError("You do not have permission to do that.", 403, "AuthenticationError", "You are not a member of this household."))
    }
    next()
}

module.exports.ownsAccount = async (req, res, next) => {
    const { userId } = req.params;
    if (userId !== req.user._id.toString()) {
        return next(new ExpressError("You do not have permission to do that.", 403, "AuthenticationError", "This account does not belong to you."))
    }
    next()
}

module.exports.ownsActivity = async (req, res, next) => {
    const { activityId } = req.params;
    const activity = await Activity.findById(activityId);
    if (!activity.user.equals(req.user._id)) {
        return next(new ExpressError("You do not have permission to do that.", 403, "AuthenticationError", "This activity does not belong to you."))
    }
    next()
}

module.exports.ownsComment = async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.user.equals(req.user._id)) {
        return next(new ExpressError("You do not have permission to do that.", 403, "AuthenticationError", "This comment does not belong to you"))
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
        return next(new ExpressError("You do not have permission to do that.", 403, "IneligibilityError", "Either you have a pending request, your request has been declined, or you are already a member."))
    }
    next()
}