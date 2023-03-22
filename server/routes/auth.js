const express = require("express");
const router = express.Router();

const {
  login,
  register,
  postForgotPasswordLink,
  updateResetedPassword,
  getResetedPassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", postForgotPasswordLink);
router
  .patch("/reset-password/:userId/:token", updateResetedPassword)
  .get("/reset-password/:userId/:token", getResetedPassword);

module.exports = router;
