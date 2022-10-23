const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const guestController = require("../Controllers/GuestController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.post(
	"/create",
	[
		body("name").notEmpty(),
		body("phoneNumber").isMobilePhone(),
		body("hotel").notEmpty(),
		body("checkIn").isDate(),
		body("checkOut").isDate(),
		body("guestType").isObject(),
		body("rooms").isArray(),
		body("amount").isNumeric(),
		body("idProof").isObject(),
	],
	verifyToken,
	guestController.createGuest
);

module.exports = router;
