const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const hotelController = require("../Controllers/HotelController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.post(
	"/get",
	[body("hotelId").notEmpty()],
	verifyToken,
	hotelController.getHotelById
);

router.post(
	"/register",
	[body("name").notEmpty(), body("phoneNumber").isMobilePhone()],
	hotelController.registerHotel
);

router.post(
	"/login",
	[body("phoneNumber").isMobilePhone()],
	hotelController.loginHotel
);

router.post(
	"/verifyOtp",
	[body("phoneNumber").isMobilePhone(), body("otp").isNumeric()],
	hotelController.verifyOtp
);

router.post(
	"/onboard",
	[body("hotelId").notEmpty()],
	verifyToken,
	hotelController.onBoardHotel
);

module.exports = router;
