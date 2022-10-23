const Room = require("../Models/Room").model;

function createRoom(reqBody) {
	return Room.create(reqBody);
}

module.exports = {
	createRoom: createRoom,
};
