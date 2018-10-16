const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Profile Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    profilephoto: {
        type: String
    },
    website: {
        type: String
    },
    bio: {
        type: String,
        max: 100
    },
    numberofposts: {
        type: Number
    },
    numberoffollowers: {
        type: Number
    },
    numberoffollowing: {
        type: Number
    },
    phonenumber: {
        type: Number,
        isprivate: Boolean
    },
    gender: {
        type: String,
        isprivate: Boolean
    },
    privacy: {
        accountprivate: {
            type: Boolean
        }
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);