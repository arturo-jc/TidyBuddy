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

module.exports.toggleTodo = async (req, res) => {
    console.log("Hit controller")
    const { householdId, typeId } = req.params;
    const activityType = await ActivityType.findById(typeId);
    if(activityType.priority > 0){
        activityType.priority = 0;
    }else{
        activityType.priority = 1;
    }
    await activityType.save();
    res.redirect(`/households/${householdId}`);
}

module.exports.togglePriority = async (req, res) => {
    const { householdId, typeId } = req.params;
    let { priority } = req.body;
    priority = (priority % 3) + 1;
    await ActivityType.findByIdAndUpdate(typeId, { priority });
    res.redirect(`/households/${householdId}`);
}

module.exports.togglePinned = async (req, res) => {
    const { householdId, typeId } = req.params;
    const activityType = await ActivityType.findById(typeId);
    activityType.pinned = !activityType.pinned;
    await activityType.save()
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