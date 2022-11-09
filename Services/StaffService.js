const { default: mongoose } = require("mongoose");
const Hotel = require("../Models/Hotel").model;
const Staff = require("../Models/Staff").model;

function addStaff(reqBody) {
	return Staff.create(reqBody);
}

function editStaff(staffId, reqBody) {
	return Staff.findByIdAndUpdate(
		mongoose.Types.ObjectId(staffId),
		{ $set: reqBody },
		{ new: true }
	);
}

function removeStaff(staffId) {
	return Staff.findByIdAndUpdate(
		mongoose.Types.ObjectId(staffId),
		{ $set: { isDeleted: true } },
		{ new: true }
	);
}

function listStaffWithStatus(hotel) {
	return Staff.aggregate([
		{
			$match: {
				isDeleted: false,
				hotel: mongoose.Types.ObjectId(hotel),
			},
		},
		{
			$group: {
				_id: "$status",
				data: {
					$push: {
						_id: "$_id",
						firstName: "$firstName",
						lastName: "$lastName",
						phoneNumber: "$phoneNumber",
						role: "$role",
						joinedAt: "$joinDate",
					},
				},
				count: {
					$sum: 1,
				},
			},
		},
	]);
}

function listStaffWithRoles(hotel) {
	return Staff.aggregate([
		{
			$match: {
				isDeleted: false,
				hotel: mongoose.Types.ObjectId(hotel),
			},
		},
		{
			$group: {
				_id: "$role",
				data: {
					$push: {
						_id: "$_id",
						firstName: "$firstName",
						lastName: "$lastName",
						phoneNumber: "$phoneNumber",
						status: "$status",
						joinedAt: "$joinDate",
					},
				},
				count: {
					$sum: 1,
				},
			},
		},
	]);
}

function listAllStaffs(hotel) {
	return Staff.find({
		isDeleted: false,
		hotel: mongoose.Types.ObjectId(hotel),
	});
}

function addRole(hotel, role) {
	return Hotel.findByIdAndUpdate(
		mongoose.Types.ObjectId(hotel),
		{ $addToSet: { roles: role } },
		{ new: true }
	);
}

module.exports = {
	addRole: addRole,
	addStaff: addStaff,
	editStaff: editStaff,
	removeStaff: removeStaff,
	listAllStaffs: listAllStaffs,
	listStaffWithRoles: listStaffWithRoles,
	listStaffWithStatus: listStaffWithStatus,
};
