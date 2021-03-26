const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAuthenticated, isAuthorized } = require("../middlewares/auth");

router.get("/user/:userId", isAuthenticated, async (req, res) => {
    
    // the id of the user who made the request
  let {id} = req;

    // userId to fetch profile data
  let {userId} = req.params

  let user;
  if(userId == id) {

    user = await User.find({ _id: userId }).select("-password -access_token -refresh_token").populate("following", "username avatar ");

  }else{

    user = await User.find({ _id: userId }).select("-password -following -access_token -refresh_token");

  }

  if (user) {
    res.status(200).send({data: user });
  } else {
    res.status(404).send({message: "User not found" });
  }
});

module.exports = router;
