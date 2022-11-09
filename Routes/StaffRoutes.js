const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const staffController = require("../Controllers/StaffController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.post(
	"/list/all",
	[body("hotel").notEmpty()],
	verifyToken,
	staffController.listAllStaff
);

router.post(
	"/list/roles",
	[body("hotel").notEmpty()],
	verifyToken,
	staffController.listStaffWithRoles
);

router.post(
	"/list/status",
	[body("hotel").notEmpty()],
	verifyToken,
	staffController.listStaffWithStatus
);

router.post(
	"/add/role",
	[body("hotel").notEmpty(), body("role").notEmpty()],
	verifyToken,
	staffController.addRole
);

router.post(
	"/add/staff",
	[
		body("hotel").notEmpty(),
		body("firstName").notEmpty(),
		body("role").notEmpty(),
		body("joinDate").isDate(),
	],
	verifyToken,
	staffController.addStaff
);

router.put(
	"/edit",
	[body("staffId").notEmpty()],
	verifyToken,
	staffController.editStaff
);

router.delete("/delete/:staffId", verifyToken, staffController.removeStaff);

module.exports = router;
