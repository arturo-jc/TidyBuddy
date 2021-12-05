const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment")

const ActivitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    household: {
        type: Schema.Types.ObjectId,
        ref: "Household",
        required: true
    }
})

ActivitySchema.post("findOneAndDelete", async function (activity) {
    if (activity) {
        await Comment.deleteMany({_id: {$in: activity.comments}})
    }
})

module.exports = mongoose.model("Activity", ActivitySchema);