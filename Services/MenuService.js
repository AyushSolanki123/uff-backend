const { default: mongoose } = require("mongoose");
const { add } = require("winston");
const Category = require("../Models/Category").model;
const Menu = require("../Models/Menu").model;
const MenuItem = require("../Models/MenuItem").model;
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

function createMenu(hotelId) {
	return new Promise((resolve, reject) => {
		let _responseBody = null;
		// create a Food menu
		// hotelId = mongoose.Types.ObjectId(hotelId)
		Menu.create({ hotel: hotelId })
			.then((menu) => {
				_responseBody = {
					food: menu,
				};
				// create a Sevice Menu
				return Menu.create({ hotel: hotelId, isService: true });
			})
			.then((menu) => {
				_responseBody = Object.assign(_responseBody, { service: menu });
				resolve(_responseBody);
			})
			.catch((error) => {
				console.log(error);
				logger.error("Failed in create Menu:" + JSON.stringify(error));
				reject(
					new ErrorBody(
						error.status || 500,
						error.message || "Internal server error"
					)
				);
			});
	});
}

function addCategoryToMenu(reqBody) {
	return Category.create(reqBody);
}

module.exports = {
	createMenu: createMenu,
	addCategoryToMenu: addCategoryToMenu,
};
