const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const menuController = require("../Controllers/MenuController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.post(
	"/create/:hotelId",
	[body("hotelId").notEmpty()],
	verifyToken,
	menuController.createMenu
);

router.post(
	"/category/create",
	[body("menu").notEmpty(), body("name").notEmpty()],
	verifyToken,
	menuController.addCategoryToMenu
);

module.exports = router;
