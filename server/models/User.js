const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 16,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    // Use a regular expression to validate the email format
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 3,
  },
});

// Define a pre-hook to hash the password before saving the user to the database
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Define a method to generate a JWT for the user
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_PASW, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Define a method to check if a given password matches the user's hashed password
UserSchema.methods.checkPassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
