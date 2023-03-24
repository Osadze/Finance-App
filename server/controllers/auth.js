const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
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

  // Check password
  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const postForgotPasswordLink = async (req, res) => {
  const { email } = req.body;
  const refererUrl = req.get("referer");
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

  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const oneTimeLink = `${refererUrl}updatePassword/${user.id}/${token}`;

  // Send email

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.EMAIL_TEST,
      pass: process.env.EMAIL_TEST_APP_PSW,
    },
  });

  let message = {
    from: '"Your Finances App" <noreply@TestfinanceApp.com>', // Sender address
    to: `${user.email}`, // List of receivers
    subject: "Reset Your Password || Personal Finance App", // Subject line
    html: `	<div style="max-width: 600px; margin: 0 auto; background-color: #f2f2f2; padding: 20px;">
		<h1 style="text-align: center; color: #007bff;">Reset Password</h1>
		<p style="text-align: center;">Please click on the link below to reset your password:</p>
		<div style="text-align: center;">
			<a href="${oneTimeLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
		</div>
		<p style="text-align: center; margin-top: 20px;">If you did not request a password reset, please ignore this message.</p>
	</div>`, // html body
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(StatusCodes.OK).json({
        msg: `Reset Password Link Has Been Sent To Your Email ${user.email}`,
      });
    })
    .catch((error) => {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    });
};
const updateResetedPassword = async (req, res) => {
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
    user.password = password1;

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
  updateResetedPassword,
  getResetedPassword,
};
