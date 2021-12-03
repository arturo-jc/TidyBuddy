const { Household } = require("../models/household");
const { Activity } = require("../models/activity");
const getFirstDayOfWeek = require("../utilities/getFirstDayOfWeek")

module.exports.displaySearchResults = async (req, res) => {
    let requestSent = false
    const pendingRequests = await Household.find({ pendingRequests: req.user })
        .select("name users")
        .populate({ path: "users", select: "username" })
    const { householdId } = req.query;
    if (householdId) {
        const household = await Household.findById(householdId)
            .select("name users pendingRequests")
            .populate({ path: "users", select: "username" })
        if (household) {
            if (household.pendingRequests.includes(req.user._id)) {
                requestSent = true
            }
            return res.render("households/find-or-create", { household, pendingRequests, requestSent })
        }
        req.flash("error", `There is no household with ID ${householdId}. Please try again.`)
        return res.redirect("/households/find-or-create")
    }
    res.render("households/find-or-create", { household: null, pendingRequests, requestSent })
}

module.exports.showHousehold = async (req, res) => {
    const { householdId } = req.params;

    const household = await Household
        .findById(householdId)
        .populate({ path: "pendingRequests", select: "username" })
        .populate({ path: "declinedRequests", select: "username" })
        .populate({ path: "users", select: "username profilePic" })
        .populate({
            path: "activityTypes",
            populate: {
                path: "completedBy",
                select: "date",
                populate: {
                    path: "user",
                    select: "username"
                }
            }
        })

    const priorityItems = household.activityTypes
        .filter(item => item.priority > 0)
        .sort((a, b) => (a.priority < b.priority) ? 1 : -1);

    const frequentItems = household.activityTypes
        .filter(item => item.priority < 1 )
        .sort((a, b) => (a.pinned === b.pinned) ? 0 : a.pinned? -1: 1)

    frequentItems.pinned = frequentItems
        .filter(item => item.pinned)

    frequentItems.unpinned = frequentItems
        .filter(item => !item.pinned)
 
    const activities = await Activity
        .find({
            household,
            date: { $gte: getFirstDayOfWeek() }
        })
        .populate({
            path: "user",
            select: "username"
        })
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username",
                populate: {
                    path: "profilePic"
                }
            }
        })
        .sort('-date')

    res.render("households/show", {
        household,
        priorityItems,
        frequentItems,
        activities
    })
}

module.exports.sendRequest = async (req, res) => {
    const { householdId } = req.params;
    const household = await Household.findByIdAndUpdate(
        householdId,
        { $addToSet: { pendingRequests: req.user } });
    req.flash("success", "Your request has been sent")
    res.redirect("/households/find-or-create")
}

module.exports.acceptRequest = async (req, res) => {
    const { householdId } = req.params;
    const { userId } = req.body;
    const household = await Household.findByIdAndUpdate(
        householdId,
        {
            $pull: { pendingRequests: userId },
            $addToSet: { users: userId }
        }
    )
    req.flash("success", "Request accepted")
    res.redirect(`/households/${household._id}`)
}

module.exports.declineRequest = async (req, res) => {
    const { householdId } = req.params;
    const { userId } = req.body;
    const household = await Household.findByIdAndUpdate(
        householdId,
        {
            $pull: { pendingRequests: userId },
            $addToSet: { declinedRequests: userId }
        }
    )
    req.flash("success", "Request declined")
    res.redirect(`/households/${household._id}`)
}

module.exports.acceptDeclined = async (req, res) => {
    const { householdId } = req.params;
    const { userId } = req.body;
    const household = await Household.findByIdAndUpdate(
        householdId,
        {
            $pull: { declinedRequests: userId },
            $addToSet: { users: userId }
        }
    )
    req.flash("success", "Request accepted.")
    res.redirect(`/households/${household._id}`)
}


module.exports.createHousehold = async (req, res) => {
    const newHousehold = new Household({
        name: req.body.name,
        users: [req.user]
    });
    await newHousehold.save();
    res.redirect(`/households/${newHousehold._id}`);
}
