const express = require("express");
const router = express.Router();

const {
  login,
  register,
  postForgotPasswordLink,
  postResetedPassword,
  getResetedPassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", postForgotPasswordLink);
router
  .patch("/reset-password/:userId/:token", postResetedPassword)
  .get("/reset-password/:userId/:token", getResetedPassword);

module.exports = router;
