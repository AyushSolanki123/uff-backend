const { default: mongoose } = require("mongoose");

const Hotel = require("../Models/Hotel").model;

function registerHotel(reqBody) {
	return Hotel.create(reqBody);
}

function onBoardHotel(hotelId, reqBody) {
	reqBody = Object.assign(reqBody, { onBoardingDone: true });
	return Hotel.findByIdAndUpdate(
		mongoose.Types.ObjectId(hotelId),
		{ $set: reqBody },
		{ new: true }
	);
}

function updateHotel(hotelId, reqBody) {
	return Hotel.findByIdAndUpdate(
		mongoose.Types.ObjectId(hotelId),
		{ $set: reqBody },
		{ new: true }
	);
}

function getHotelbyPhoneNumber(phoneNumber) {
	return Hotel.findOne({ phoneNumber: phoneNumber, isDeleted: false });
}

function getHotelById(hotel) {
	return Hotel.findOne({
		_id: mongoose.Types.ObjectId(hotel),
		isDeleted: false,
	});
}

module.exports = {
	registerHotel: registerHotel,
	onBoardHotel: onBoardHotel,
	updateHotel: updateHotel,
	getHotelById: getHotelById,
	getHotelbyPhoneNumber: getHotelbyPhoneNumber,
};
