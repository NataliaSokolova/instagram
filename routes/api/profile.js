const express = require("express");
const passport = require("passport");
const Profile = require("../../models/Profile");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ msg: "Profile route works!!" });
});

//@route  GET /api/profile/
//@desc   Render user profile
//@access private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email
    });
  }
);

router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};

    profileFields.user = req.user.id;
    if (req.body.profilephoto) {
      profileFields.profilephoto = req.body.profilephoto;
    }
    if (req.body.website) {
        profileFields.website = req.body.website;
    }
    if (req.body.bio) {
        profileFields.bio = req.body.bio;
    }
    if (req.body.phonenumber) {
        profileFields.phonenumber = req.body.phonenumber;
    }
    if (req.body.gender) {
        profileFields.gender = req.body.gender;
    }

    if (req.body.privacy_accountprivate) {
        profileFields.privacy = {};
        profileFields.privacy.accountprivate = req.body.privacy_accountprivate;
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true },
          function(err, doc) {
            if (err) {
              console.log("Something wrong when updating data!");
            }
            console.log(doc);
          }
        ).then(profile => {
          res.json(profile);
        });
      } else {
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);

module.exports = router;
