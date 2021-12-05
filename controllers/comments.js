const Comment = require("../models/comment")
const Activity = require("../models/activity")

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
    const urlEnd = `?activityId=${activityId}#${newComment._id}`
    const {commentsRedirectTo} = req.body;
    switch(commentsRedirectTo){
        case "dashboard":
            return res.redirect(`/households/${householdId}${urlEnd}`);
        case "activities":
            return res.redirect(`/households/${householdId}/activities${urlEnd}`)
        default:
            return res.redirect(`/households/${householdId}${urlEnd}`);
    }
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