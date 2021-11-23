const { Activity } = require("../models/activity");
const { ActivityType } = require("../models/activity-type")

module.exports.createActivity = async (req, res) => {
    const { typeId } = req.body;
    const activityType = await ActivityType.findByIdAndUpdate(typeId, { priority: 0 });
    const newActivity = new Activity({
        name: activityType.name,
        date: new Date()
    })
    activityType.completedBy.push(newActivity);
    if (activityType.completedBy.length > 5) {
        activityType.completedBy.shift();
    };
    await newActivity.save();
    await activityType.save();
    res.redirect("/")
}

module.exports.deleteActivity = async (req, res) => {
    const { activityId } = req.params;
    await Activity.findByIdAndDelete(activityId);
    res.redirect("/")
}