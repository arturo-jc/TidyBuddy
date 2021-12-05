const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const ProfilePicSchema = new Schema({
    url: String,
    filename: String
})

ProfilePicSchema.virtual("thumbnailLg").get(function(){
    const cropSize = 400
    const width = 200
    return this.url.replace("/upload", `/upload/c_crop,g_face,h_${cropSize},w_${cropSize}/r_max/c_scale,w_${width}`)
})

ProfilePicSchema.virtual("thumbnailSm").get(function(){
    const cropSize = 400
    const width = 40
    return this.url.replace("/upload", `/upload/c_crop,g_face,h_${cropSize},w_${cropSize}/r_max/c_scale,w_${width}`)
})

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "No email was given."],
        unique: true
    },
    profilePic: ProfilePicSchema
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema)