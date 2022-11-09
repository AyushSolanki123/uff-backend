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

router.post(
	"/list",
	[body("hotel").notEmpty(), body("status").notEmpty()],
	verifyToken,
	guestController.listGuestFilteredByStatus
);

router.post(
	"/search",
	[body("hotel").notEmpty(), body("name").notEmpty()],
	verifyToken,
	guestController.searchGuestByName
);

router.put(
	"/update",
	[body("guestId").notEmpty(), body("data").isObject()],
	verifyToken,
	guestController.updateGuest
);

router.post(
	"/room/allot",
	[body("guestId").notEmpty(), body("rooms").isArray()],
	verifyToken,
	guestController.allotRoomToGuest
);

module.exports = router;
