const GuestService = require("../Services/GuestService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");
const RoomService = require("../Services/RoomService");

function createGuest(req, res, next) {
	const { errors } = validationResult(req.body);
	if (errors.length > 0) {
		logger.error("Error in create Guest request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		GuestService.createGuest(req.body)
			.then((response) => {
				res.status(200);
				res.json({
					data: response,
					message: "Guest added Successfully",
				});
			})
			.catch((error) => {
				logger.error(
					"Failed in create guest: " + JSON.stringify(error)
				);
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Internal Server Error"
					)
				);
			});
	}
}

function listGuestFilteredByStatus(req, res, next) {
	const { errors } = validationResult(req.body);
	if (errors.length > 0) {
		logger.error("Error in list Guest request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		let { page, size } = req.query;

		const { hotel, status } = req.body;

		if (!page) page = 1;

		if (!size) size = 10;

		let limit = parseInt(size);
		let skip = (page - 1) * size;
		let paginate = true;
		GuestService.listGuestFilteredByStatus(hotel, status, skip, limit)
			.then((response) => {
				if (limit == 0 || response.length < limit) paginate = false;
				res.status(200);
				res.json({
					data: response,
					next: paginate,
					message: "Guest Fetched Successfully",
				});
			})
			.catch((error) => {
				logger.error("Failed in list guest: " + JSON.stringify(error));
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Internal Server Error"
					)
				);
			});
	}
}

function searchGuestByName(req, res, next) {
	const { errors } = validationResult(req.body);
	if (errors.length > 0) {
		logger.error("Error in search Guest request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		let { page, size } = req.query;

		const { hotel, name } = req.body;

		if (!page) page = 1;

		if (!size) size = 10;

		let limit = parseInt(size);
		let skip = (page - 1) * size;
		let paginate = true;
		GuestService.searchGuestByName(hotel, name, skip, limit)
			.then((response) => {
				if (limit == 0 || response.length < limit) paginate = false;
				res.status(200);
				res.json({
					data: response,
					next: paginate,
					message: "Guest Fetched Successfully",
				});
			})
			.catch((error) => {
				logger.error(
					"Failed in search guest: " + JSON.stringify(error)
				);
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Internal Server Error"
					)
				);
			});
	}
}

function allotRoomToGuest(req, res, next) {
	const { errors } = validationResult(req.body);
	if (errors.length > 0) {
		logger.error("Error in allot room to Guest request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		const { guestId, rooms } = req.body;
		GuestService.allotRoomToGuest(guestId, rooms)
			.then((response) => {
				res.status(200);
				res.json({
					data: response,
					message: "Rooms alloted successfully",
				});
			})
			.catch((error) => {
				logger.error(
					"Failed in allot room to guest: " + JSON.stringify(error)
				);
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Internal Server Error"
					)
				);
			});
	}
}

function updateGuest(req, res, next) {
	const { errors } = validationResult(req.body);
	if (errors.length > 0) {
		logger.error("Error in update Guest request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		const { guestId, data } = req.body;
		GuestService.updateGuest(guestId, data)
			.then((response) => {
				res.status(200);
				res.json({
					data: response,
					message: "Guest Details updated successfully",
				});
			})
			.catch((error) => {
				logger.error(
					"Failed in update guest: " + JSON.stringify(error)
				);
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Internal Server Error"
					)
				);
			});
	}
}

module.exports = {
	createGuest: createGuest,
	listGuestFilteredByStatus: listGuestFilteredByStatus,
	searchGuestByName: searchGuestByName,
	allotRoomToGuest: allotRoomToGuest,
	updateGuest: updateGuest,
};
