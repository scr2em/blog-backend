const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/token");
const passwordHash = require("password-hash");




router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).send({message: "this email doesn't exist" });
    return;
  }

  if (user.disabled || user.refresh_token.length == 0) {
    res.status(403).send({message:"this email is disabled" });
    return;
  }

  const confirmPassword = await passwordHash.verify(password, user.password);
  if (!confirmPassword) {
    res.status(403).send({message: "wrong password" });
    return;
  }

  let access_token = createAccessToken(user._id);
  let refresh_token = createRefreshToken(user._id);

  // why not User.updateOne({ email}, {access_token,refresh_token})
  User.findOne({ email }).then((doc) =>
    User.updateOne({ _id: doc._id }, { access_token, refresh_token })
  );

  res.status(200).send({ data:{email, access_token, refresh_token }});

});
router.post("/signup", async (req, res) => {
  let { username, email, password, bio } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    res.status(409).send({message: "email is already registered" });
    return;
  }


  User.create({ username, email, password, bio }, async function (err, data) {
    if (err) {
      res.stats(500).send({message:err});
    } else {
      res.status(200).send({data:{
        id: data._id,
        username: data.username,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }});
    }
  });


});
module.exports = router;
