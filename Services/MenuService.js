const { default: mongoose } = require("mongoose");
const Menu = require("../Models/Menu").model;
const MenuItem = require("../Models/MenuItem").model;
const ErrorBody = require("../Utils/ErrorBody");
const logger = require("../Utils/Logger");

function createMenu(hotelId) {
	return new Promise((resolve, reject) => {
		let _responseBody = null;
		// create a Food menu
		Menu.create({ hotel: hotelId })
			.then((menu) => {
				_responseBody = {
					food: menu,
				};
				return Menu.create({ hotel: hotelId, isService: true });
			})
			.then((menu) => {
				_responseBody = Object.assign(_responseBody, { service: menu });
				resolve(_responseBody);
			})
			.catch((error) => {
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

module.exports = {
	createMenu: createMenu,
};
