const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load posts models
const UserPosts = require('../../models/posts');
const User = mongoose.model('users');

//@route  GET /api/posts
//@desc   Render user posts
//@access private

router.get('/',passport.authenticate('jwt', {session : false}),
(req, res) => {
    let errors = {};
    UserPosts.findOne({user : req.user.id})
    .populate('user',['username','avatar'])
    .then(userPosts => {
        if(!userPosts)
        {
            errors.noPosts = 'There is no posts for this user';
            return res.status(404).json(errors);
        }
        res.json(userPosts);
    })
    .catch(err => res.status(400).json(err));
}
);

//@route  GET /api/posts
//@desc   Render user posts
//@access private
router.post('/',passport.authenticate('jwt', {session: false}),
(req,res) => {
    const postsFields = {};
    postsFields.user = req.user.id;
    if(req.body.location) postsFields.location = req.body.location;
    if(req.body.description) postsFields.description = req.body.description;

    
    postsFields.media={};
    if(req.body.url) postsFields.media.url = req.body.url;
    if(req.body.likes) postsFields.media.likes = req.body.likes;
    if(typeof req.body.comments !== 'undefined'){
        postsFields.media.comments= req.body.comments.split(',');
    }
    if(req.body.bookmark) postsFields.media.bookmark = req.body.bookmark;
    if(typeof req.body.tagPeople !== 'undefined'){
        postsFields.media.tagPeople= req.body.tagPeople.split(',');
    }


    UserPosts.findOne({ user: req.user.id })
    .then(userPosts => {
            //Create
            new UserPosts(postsFields)
            .save()
            .then(userPosts => res.json(userPosts))
            .catch(err => console.log(err));
        }
    )
});

module.exports= router;