const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const roomController = require("../Controllers/RoomController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.post(
	"/create",
	[
		body("hotel").notEmpty(),
		body("number").isNumeric(),
		body("type").notEmpty(),
	],
	verifyToken,
	roomController.createRoom
);

router.get("/list", verifyToken, roomController.listRooms);

module.exports = router;
