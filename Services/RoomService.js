const { default: mongoose } = require("mongoose");

const Room = require("../Models/Room").model;

function createRoom(reqBody) {
	return Room.create(reqBody);
}

function listRooms(hotelId) {
	return Room.find({
		hotel: mongoose.Types.ObjectId(hotelId),
		isDeleted: false,
	});
}

module.exports = {
	createRoom: createRoom,
	listRooms: listRooms,
};
