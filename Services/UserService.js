const User = require("../Models/User").model;

function listUsers() {
	return User.find({}).sort({ updatedAt: -1 }).select("-password");
}

function getUserByMobile(mobile) {
	return User.findOne({ mobile: mobile });
}

function addUser(userBody) {
	return User.create(userBody);
}

function getUserById(id) {
	return User.findById(id).select("-password");
}

function updateUser(id, reqBody) {
	return User.findByIdAndUpdate(id, { $set: reqBody }, { new: true });
}

module.exports = {
	getUserByMobile: getUserByMobile,
	addUser: addUser,
	getUserById: getUserById,
	updateUser: updateUser,
	listUsers: listUsers,
};
