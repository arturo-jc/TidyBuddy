const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports.Comment = mongoose.model("Comment", CommentSchema);