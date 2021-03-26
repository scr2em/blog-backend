const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const { isAuthenticated, isAuthorized } = require("../middlewares/auth");

router.post("/follow:followingId", isAuthenticated, async (req, res) => {
    let {followingId} = req.params
  if (!mongoose.isValidObjectId(followingId)) {
    res.status(404).send({message: "Bad formatted ID" });
    return;
  }

  let userTofollow = await User.findOne({ _id: followingId });

  if (!userTofollow) {
    res.status(404).send({message: "Ops, couldn't find any user with this ID"});
    return;
  }

  let userId = req.id;

  if (userId == followingId) {
    res.status(400).send({message: `You can't follow yourself` });
    return;
  }
  User.updateOne(
    { _id: userId },
    { $addToSet: { following: followingId } },
    function (err, data) {
      if (err) {
        res.status(500).send({message: "Something went wrong" });
      } else {
        res.status(201).send({message: "this ID has been added to your following list."});
      }
    }
  );
});
router.post("/unfollow:followingId", isAuthenticated, async (req, res) => {
  let {followingId} = req.params
if (!mongoose.isValidObjectId(followingId)) {
  res.status(404).send({message: "Bad formatted ID" });
  return;
}

let userTofollow = await User.findOne({ _id: followingId });

if (!userTofollow) {
  res.status(404).send({message: "Ops, couldn't find any user with this ID"});
  return;
}

let userId = req.id;

if (userId == followingId) {
  res.status(400).send({message: `You can't unfollow yourself` });
  return;
}
User.updateOne(
  { _id: userId },
  { $pull: { following: [followingId] } },
  function (err, data) {
    if (err) {
      res.status(500).send({message: "Something went wrong" });
    } else {
      res.status(201).send({message: "You have unfollowed this user successfully"});
    }
  }
);
});
module.exports = router;
