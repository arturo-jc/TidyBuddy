const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivityTypeSchema = new Schema({
    name: {
        type: String,
        required: [true, "Your task needs a name."]
    },
    pinned: {
        type: Boolean,
        required: true
    },
    priority: {
        type: Number,
        min: 0,
        max: 3
    },
    completedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "Activity"
        }
    ]
})

module.exports.ActivityType = mongoose.model("ActivityType", ActivityTypeSchema);