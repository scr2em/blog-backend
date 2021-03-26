// General Import
const passwordHash = require("password-hash");
const validator = require("validator");
// Mongo import
const mongoose = require("mongoose");
const { createAccessToken, createRefreshToken } = require("../utils/token");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: [true, "This email ss already used"],
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
    bio: {
      type: String,
      required: false,
    },
    avatar:{
      type:String,
      default:"https://www.worldfuturecouncil.org/wp-content/uploads/2020/06/blank-profile-picture-973460_1280-1.png"
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "users",
      },
    ],
    disabled: {
      type: Boolean,
      required: [false, "User Status Must Be Identified (Banned or Not)"],
      default: false,
    },
    access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
    },
  },
  { timestamps: true }
);
// Hash Password Before Saving Document
userSchema.pre("save", function (next) {
  this.password = passwordHash.generate(this.password);
  this.access_token = createAccessToken(this._id);
  this.refresh_token = createRefreshToken(this._id);
  next();
});
const User = mongoose.model("users", userSchema);
module.exports = User;
