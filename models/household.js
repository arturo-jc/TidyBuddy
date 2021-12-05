const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HouseholdSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Your household needs a name."]
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],
        activityTypes: [{
            type: Schema.Types.ObjectId,
            ref: "ActivityType"
        }],
        pendingRequests: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        declinedRequests: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    }
)

module.exports = mongoose.model("Household", HouseholdSchema);