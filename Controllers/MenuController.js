const MenuService = require("../Services/MenuService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

function createMenu(req, res, next) {
	const { hotelId } = req.params;
	MenuService.createMenu(hotelId)
		.then((response) => {
			res.status(200);
			res.json({
				data: response,
				message: "Menu Created Successfully",
			});
		})
		.catch((error) => {
			logger.error("Failed in create Menu: " + JSON.stringify(error));
			next(
				new ErrorBody(
					error.statusCode || 500,
					error.errorMessage || "Internal Server Error"
				)
			);
		});
}

function addCategoryToMenu(req, res, next) {
	const { errors } = validationResult(req.body);
	if (errors.length > 0) {
		logger.error(
			"Error in register Hotel request body: ",
			JSON.stringify(errors)
		);
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		MenuService.addCategoryToMenu(req.body)
			.then((response) => {
				res.status(200);
				res.json({
					data: response,
					message: "Category Added to Menu Successfully",
				});
			})
			.catch((error) => {
				logger.error(
					"Failed in add Category to Menu: " + JSON.stringify(error)
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
	createMenu: createMenu,
	addCategoryToMenu: addCategoryToMenu,
};
