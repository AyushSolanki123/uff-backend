const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const staffController = require("../Controllers/StaffController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.get("/list/roles/:hotelId", verifyToken, staffController.listRoles);

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
	"/search/staff",
	[body("hotel").notEmpty(), body("firstName").notEmpty()],
	verifyToken,
	staffController.searchStaff
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
	"/edit/staff",
	[body("staffId").notEmpty()],
	verifyToken,
	staffController.editStaff
);

router.put(
	"/edit/role",
	[
		body("hotel").notEmpty(),
		body("roleId").notEmpty(),
		body("role").notEmpty(),
	],
	verifyToken,
	staffController.editRole
);

router.delete("/delete/:staffId", verifyToken, staffController.removeStaff);

module.exports = router;
