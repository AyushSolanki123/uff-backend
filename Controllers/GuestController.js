const GuestService = require("../Services/GuestService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

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

module.exports = {
	createGuest: createGuest,
};
