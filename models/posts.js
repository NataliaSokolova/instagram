const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mediaContent = new Schema({
    url:{
        type: String,
        required: true       
    },
    likes:{
        type: Number,
        required: true
    },
    comments: {
        type : [String],
        required : true
    },
    tagPeople:{
        type: [String],
        required: false
    },
    bookMark:{ 
        type: Boolean,
        default: false
    }
});
//Instantiate Schema Object 
const UserPostsSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    media: mediaContent,
    location :{
        type: String,
        required : false
    },
    description:{
        type: String,
        required : false
    },
    dateOfPost:{
        type: Date,
        default: Date.now,
        required: true
    },
    durationOfPost:{
        type: Number,
        default: 1,
        required: false
    },
    commentFlag : {
        type: Boolean,
        default: false
    }
});

module.exports = UserPosts = mongoose.model('posts',UserPostsSchema);