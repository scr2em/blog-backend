const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const { isAuthenticated, isAuthorized } = require("../middlewares/auth");

router.post("/follow", isAuthenticated, async (req, res) => {
  let { process = "follow", followingId } = req.body;

  let prcoessTypes = ["follow", "unfollow"];
  
  if (!prcoessTypes.includes(process)) {
    res.status(400).send({message: "Invalid process" });
    return;
  }
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
    res.status(400).send({message: `You can't ${process} yourself` });
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

module.exports = router;
