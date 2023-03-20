const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
// /droebit
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please Provide Email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // check password

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const postForgotPasswordLink = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please Provide Email");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const secret = process.env.JWT_PASW + user.password;

  const payload = {
    email: user.email,
    _id: user.id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "5m" });
  const oneTimeLink = `http://localhost:3000/api/v1/auth/reset-password/${user.id}/${token}`;
  console.log(oneTimeLink, "Link");
  res.status(StatusCodes.OK).json({ oneTimeLink, token });
};
const getForgotPasswordLink = async (req, res) => {};
const postResetedPassword = async (req, res) => {
  const { userId, token } = req.params;
  let { password1, password2 } = req.body;
  const user = await User.findOne({ _id: userId });
  if (!user || user._id != userId) {
    throw new UnauthenticatedError("Invalid Credentials 1");
  }
  const secret = process.env.JWT_PASW + user.password;

  try {
    const payload = jwt.verify(token, secret);
    // Add validation rules for password and password2
    await body("password1", "Password is required").notEmpty().run(req);
    await body("password2", "Passwords do not match")
      .equals(password1)
      .run(req);

    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    password1 = await bcrypt.hash(password1, 10);
    user.password = password1;

    //TODO CLEANUP/////////////////////////////////////////////////////////
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "working", password: user.password });
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("Invalid Credentials 2");
  }
};

const getResetedPassword = async (req, res) => {
  const { userId, token } = req.params;

  const user = await User.findOne({ _id: userId });
  if (!user || user._id != userId) {
    throw new UnauthenticatedError("Invalid Credentials 1");
  }
  const secret = process.env.JWT_PASW + user.password;

  try {
    const payload = jwt.verify(token, secret);
    res.status(StatusCodes.OK).json({ message: "working", email: user.email });
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("Invalid Credentials 2");
  }
};

module.exports = {
  register,
  login,
  postForgotPasswordLink,
  getForgotPasswordLink,
  postResetedPassword,
  getResetedPassword,
};
