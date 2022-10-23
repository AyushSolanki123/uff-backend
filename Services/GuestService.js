const { default: mongoose } = require("mongoose");

const Guest = require("../Models/Guest").model;

function createGuest(reqBody) {
	return Guest.findByIdAndUpdate(mongoose.Types.ObjectId(), reqBody, {
		new: true,
		upsert: true,
		runValidators: true,
		setDefaultsOnInsert: true,
	}).populate(["hotel", "rooms"]);
}

module.exports = {
	createGuest: createGuest,
};
