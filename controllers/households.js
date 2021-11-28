const { Household } = require("../models/household");
const { Activity } = require("../models/activity");

module.exports.findHousehold = async (req, res) => {
    const { householdId } = req.query;
    const household = await Household.findById(householdId)
        .select("name users")
        .populate({
            path: "users",
            select: "username"
        })
    if (household) {
        return res.render("households/choose", { household })
    }
    req.flash("error", "No household exists with that ID. Please try again.")
    res.redirect("/households/choose")
}

module.exports.showHousehold = async (req, res) => {
    const { householdId } = req.params;

    const household = await Household.findById(householdId)
        .populate({ path: "pendingRequests", select: "username" })
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

    const frequentItems = household.activityTypes.filter(item => item.priority < 1)

    const activities = await Activity.find({ household })
        .populate({
            path: "user",
            select: "username"
        })
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username"
            }
        })

    res.render("households/show", {
        household,
        priorityItems,
        frequentItems,
        activities
    })
}

module.exports.updateHousehold = async (req, res) => {
    const { householdId } = req.params;
    const { action } = req.body;
    switch (action) {
        case "sendRequest":
            const household = await Household.findByIdAndUpdate(
                householdId,
                { $addToSet: { pendingRequests: req.user } });
            res.send("Your request has been sent")
    }
    switch (action) {
        case "acceptRequest":
            const { userId } = req.body;
            const household = await Household.findOneAndUpdate(
                householdId,
                {
                    $pull: { pendingRequests: userId },
                    $addToSet: { users: userId }
                }
            )
            res.send("User added")
    }
    switch (action) {
        case "declineRequest":
            const { userId } = req.body;
            const household = await Household.findOneAndUpdate(
                householdId,
                {
                    $pull: { pendingRequests: userId },
                    $addToSet: { declinedRequests: userId }
                }
            )
            res.send("Request declined")
    }
}

module.exports.createHousehold = async (req, res) => {
    const newHousehold = new Household({
        name: req.body.name,
        users: [req.user]
    });
    await newHousehold.save();
    res.redirect(`/households/${newHousehold._id}`);
}
