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

module.exports.markToDo = async (req, res) => {
    const { householdId, typeId } = req.params;
    await ActivityType.findByIdAndUpdate(typeId, { $inc: { priority: 1 } });
    res.redirect(`/households/${householdId}`);
}

module.exports.unmarkToDo = async (req, res) => {
    const { householdId, typeId } = req.params;
    await ActivityType.findByIdAndUpdate(typeId, { priority: 0 });
    res.redirect(`/households/${householdId}`);
}

module.exports.togglePriority = async (req, res) => {
    const { householdId, typeId } = req.params;
    let { priority } = req.body;
    priority = (priority % 3) + 1;
    await ActivityType.findByIdAndUpdate(typeId, { priority });
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