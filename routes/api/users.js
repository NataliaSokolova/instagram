const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// @route   POST api/users/register
// @desc    Register User
// @access  Public

router.post('/register', (req, res) => {

  const {errors, isValid} = validateRegisterInput(req.body);
  
  //Check for validtion
  if (!isValid){
    return res.status(400).json(errors);
}

  User.findOne({email: req.body.email})
         .then(user => {
             if (user){
                  return res.status(400).json({email: 'Email already exists'});
             }
             else {
                 const avatar = gravatar.url(req.body.email, {
                     s: '200',
                     r: 'pg',
                     d: 'mm'
                 });
  
                 const newUser = new User({
                   username: req.body.username,
                     name: req.body.name,
                     email: req.body.email,
                     avatar: avatar,
                     password: req.body.password
                 });
  
                 bcrypt.genSalt(10, (err, salt) => {
                     if(err) throw err;
                     bcrypt.hash(newUser.password, salt, (err, hash) => {
                         if(err) throw err;
                         newUser.password = hash;
                         newUser.save()
                             .then(user => res.json(user))
                             .catch(err => console.log(err));
                     })
                 });
             }
         })
  });
  

//@route POST api/user/login
//@desc  Login user / return a JWT token
//@access Public

router.post('/login', (req,res) => {
const {errors, isValid} = validateLoginInput(req.body);

//check for validation

if(!isValid) {
  return res.status(400).json(errors);
}

  const email = req.body.email;
  const password = req.body.password;


  User.findOne({email})
  .then(user => {
    //check for the user
    if(!user) {
      return res.status(404).json({email: 'User not found'});
    }

    //check for password
    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if(isMatch) {
        //User matched
        const payload =  {id: user.id, name: user.name,
        avatar: user.avatar};

        //Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {expiresIn: 3600},
          (err, token) => {
            if(err) throw err;
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );


      } else {
        return res.status(400).json({password: 'password incorrect'});
      }
    })
  })
});


// @route   GET api/users/current
// @desc    Tests the user route
// @access  Public
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
}
);

module.exports = router;