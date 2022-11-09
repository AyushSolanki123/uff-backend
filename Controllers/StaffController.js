const StaffService = require("../Services/StaffService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

function listAllStaff(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in list Staff request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		StaffService.listAllStaffs(req.body.hotel)
			.then((response) => {
				res.status(200);
				res.json({
					staff: response,
					message: "Staff Fetched Successfully",
				});
			})
			.catch((error) => {
				logger.error("Failed in list Staff" + JSON.stringify(error));
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Server error occurred"
					)
				);
			});
	}
}

function listStaffWithRoles(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in list Staff request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		StaffService.listStaffWithRoles(req.body.hotel)
			.then((response) => {
				res.status(200);
				res.json({
					staff: response,
					message: "Staff Fetched Successfully",
				});
			})
			.catch((error) => {
				logger.error("Failed in list Staff" + JSON.stringify(error));
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Server error occurred"
					)
				);
			});
	}
}

function listStaffWithStatus(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in list Staff request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		StaffService.listStaffWithStatus(req.body.hotel)
			.then((response) => {
				res.status(200);
				res.json({
					staff: response,
					message: "Staff Fetched Successfully",
				});
			})
			.catch((error) => {
				logger.error("Failed in list Staff" + JSON.stringify(error));
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Server error occurred"
					)
				);
			});
	}
}

function addStaff(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in add Staff request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		StaffService.addStaff(req.body)
			.then((response) => {
				res.status(200);
				res.json({
					staff: response,
					message: "Staff Added Successfully",
				});
			})
			.catch((error) => {
				logger.error("Failed in add Staff" + JSON.stringify(error));
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Server error occurred"
					)
				);
			});
	}
}

function editStaff(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in edit Staff request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		const { staffId, ...reqBody } = req.body;
		StaffService.editStaff(staffId, reqBody)
			.then((response) => {
				res.status(200);
				res.json({
					staffs: response,
					message: "Staff Edited Successfully",
				});
			})
			.catch((error) => {
				logger.error("Failed in edit Staff" + JSON.stringify(error));
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Server error occurred"
					)
				);
			});
	}
}

function removeStaff(req, res, next) {
	const staffId = req.params.staffId;
	StaffService.removeStaff(staffId)
		.then((response) => {
			res.status(200);
			res.json({
				staff: response,
				message: "Staff removed Successfully",
			});
		})
		.catch((error) => {
			logger.error("Failed in removed Staff" + JSON.stringify(error));
			next(
				new ErrorBody(
					error.statusCode || 500,
					error.errorMessage || "Server error occurred"
				)
			);
		});
}

function addRole(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in add role request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		const { hotel, role } = req.body;
		StaffService.addRole(hotel, role)
			.then((response) => {
				res.status(200);
				res.json({
					staff: response,
					message: "Staff removed Successfully",
				});
			})
			.catch((error) => {
				logger.error("Failed in removed Staff" + JSON.stringify(error));
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Server error occurred"
					)
				);
			});
	}
}

module.exports = {
	addRole: addRole,
	addStaff: addStaff,
	editStaff: editStaff,
	removeStaff: removeStaff,
	listAllStaff: listAllStaff,
	listStaffWithRoles: listStaffWithRoles,
	listStaffWithStatus: listStaffWithStatus,
};
