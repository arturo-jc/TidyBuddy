const { Comment } = require("../models/comment")
const { Activity } = require("../models/activity")

module.exports.createComment = async (req, res) => {
    const { householdId, activityId } = req.params;
    const parentActivity = await Activity.findById(activityId);
    const newComment = new Comment({
        user: req.user,
        body: req.body.body,
        date: new Date()
    });
    parentActivity.comments.push(newComment);
    await parentActivity.save();
    await newComment.save();
    res.redirect(`/households/${householdId}`);
}

module.exports.deleteComment = async (req, res) => {
    req.flash("success", "Successfully deleted comment.")
    const { householdId, activityId, commentId } = req.params;
    await Activity.findByIdAndUpdate(
        activityId,
        { $pull: { comments: commentId } }
    )
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/households/${householdId}`);
}