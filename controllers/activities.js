const { Household } = require("../models/household")
const { ActivityType } = require("../models/activity-type");
const { Activity } = require("../models/activity");

module.exports.createActivity = async (req, res) => {
    const { householdId } = req.params;
    const { typeId } = req.body;
    // const household = await Household.findById(householdId);
    // Check if it's actually necessary to find the household object, maybe I can just store the ID
    const activityType = await ActivityType.findByIdAndUpdate(typeId, { priority: 0 });
    const newActivity = new Activity({
        name: activityType.name,
        date: new Date(),
        user: req.user,
        household: householdId
    })
    activityType.completedBy.push(newActivity);
    if (activityType.completedBy.length > 5) {
        activityType.completedBy.shift();
    };
    await newActivity.save();
    await activityType.save();
    res.redirect(`/households/${householdId}`);
}

module.exports.deleteActivity = async (req, res) => {
    const { householdId, activityId } = req.params;
    const activity = await Activity.findByIdAndDelete(activityId);
    const parentActivityType = await ActivityType.findOneAndUpdate(
        { name: activity.name },
        { $pull: { completedBy: activityId } }
    );
    res.redirect(`/households/${householdId}`);
}