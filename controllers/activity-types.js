const { ActivityType } = require("../models/activity-type");

module.exports.addActivityType = async (req, res) => {
    const newActivityType = new ActivityType({
        name: req.body.name,
        pinned: false,
        priority: 0
    });
    await newActivityType.save();
    res.redirect("/");
}

module.exports.updateActivityType = async (req, res) => {
    const { typeId } = req.params;
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
    res.redirect("/");
}

module.exports.deleteActivityType = async (req, res) => {
    const { typeId } = req.params;
    await ActivityType.findByIdAndDelete(typeId);
    res.redirect("/")
}