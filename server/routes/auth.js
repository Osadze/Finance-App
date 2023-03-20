const express = require("express");
const router = express.Router();

const {
  login,
  register,
  postForgotPasswordLink,
  getForgotPasswordLink,
  postResetedPassword,
  getResetedPassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router
  .post("/forgot-password", postForgotPasswordLink)
  .get("/forgot-password", getForgotPasswordLink);
router
  .patch("/reset-password/:userId/:token", postResetedPassword)
  .get("/reset-password/:userId/:token", getResetedPassword);

module.exports = router;
