const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const authController = require("../Controllers/AuthController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.post(
	"/register",
	[body("firstName").notEmpty(), body("phoneNumber").isMobilePhone()],
	authController.registerUser
);

router.post(
	"/login",
	[body("phoneNumber").isMobilePhone()],
	authController.loginUser
);

router.post(
	"/verifyOTP",
	[body("phoneNumber").isMobilePhone(), body("otp").isNumeric()],
	authController.verifyOTP
);

router.post(
	"/resendOTP",
	[body("phoneNumber").isMobilePhone()],
	authController.resendOtp
);

router.post(
	"/refreshToken",
	[body("refreshToken").notEmpty()],
	authController.refreshToken
);

module.exports = router;
