const { Comment } = require("../models/comment")
const { Activity } = require("../models/activity")

module.exports.createComment = async (req, res) => {
    const { activityId } = req.params;
    const parentActivity = await Activity.findById(activityId);
    const newComment = new Comment({
        body: req.body.body,
        date: new Date()
    });
    parentActivity.comments.push(newComment);
    await parentActivity.save();
    await newComment.save();
    res.redirect("/")
}