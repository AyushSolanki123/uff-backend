const RoomService = require("../Services/RoomService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

function createRoom(req, res, next) {
	const { errors } = validationResult(req.body);
	if (errors.length > 0) {
		logger.error("Error in create Room request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		RoomService.createRoom(req.body)
			.then((room) => {
				res.status(200);
				res.json({
					data: room,
					message: "Room added to hotel successfully",
				});
			})
			.catch((error) => {
				logger.error("Failed in create room: " + JSON.stringify(error));
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Internal Server Error"
					)
				);
			});
	}
}

function listRooms(req, res, next) {
	const { hotel } = req.query;

	RoomService.listRooms(hotel)
		.then((rooms) => {
			res.status(200);
			res.json({
				data: rooms,
				message: "Rooms fetched successfully",
			});
		})
		.catch((error) => {
			logger.error("Failed in list rooms: " + JSON.stringify(error));
			next(
				new ErrorBody(
					error.statusCode || 500,
					error.errorMessage || "Internal Server Error"
				)
			);
		});
}

module.exports = {
	createRoom: createRoom,
	listRooms: listRooms,
};
