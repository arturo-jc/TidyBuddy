const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    body: {
        type: String,
        required: [true, "Your comment needs some content."]
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("Comment", CommentSchema);