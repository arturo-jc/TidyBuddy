const { ActivityType } = require("../models/activity-type");
const { Household } = require("../models/household")

module.exports.addActivityType = async (req, res) => {
    const { householdId } = req.params;
    const household = await Household.findById(householdId);
    const newActivityType = new ActivityType({
        name: req.body.name,
        pinned: false,
        priority: 0
    });
    household.activityTypes.push(newActivityType);
    await household.save();
    await newActivityType.save();
    res.redirect(`/households/${householdId}`);
}

module.exports.updateActivityType = async (req, res) => {
    const { householdId, typeId } = req.params;
    const { action } = req.body;
    switch (action) {
        case "mark-to-do":
            await ActivityType.findByIdAndUpdate(typeId, { $inc: { priority: 1 } });
            break;
        case "unmark-to-do":
            await ActivityType.findByIdAndUpdate(typeId, { priority: 0 });
            break;
        case "toggle-priority":
            let { priority } = req.body;
            priority = (priority % 3) + 1;
            await ActivityType.findByIdAndUpdate(typeId, { priority });
            break;
    }
    res.redirect(`/households/${householdId}`);
}

module.exports.deleteActivityType = async (req, res) => {
    const { householdId, typeId } = req.params;
    await Household.findByIdAndUpdate(
        householdId,
        { $pull: { activityTypes: typeId } }
    )
    await ActivityType.findByIdAndDelete(typeId);
    res.redirect(`/households/${householdId}`);
}