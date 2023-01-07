const { default: mongoose } = require("mongoose");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");
const Role = require("../Models/Role").model;
const Hotel = require("../Models/Hotel").model;
const Staff = require("../Models/Staff").model;

function addStaff(reqBody) {
    return Staff.findByIdAndUpdate(mongoose.Types.ObjectId(), reqBody, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
    }).populate("role");
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
            $lookup: {
                from: "roles",
                localField: "role",
                foreignField: "_id",
                as: "role",
            },
        },
        {
            $unwind: {
                path: "$role",
                preserveNullAndEmptyArrays: true,
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
        {
            $sort: {
                _id: 1,
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
            $lookup: {
                from: "roles",
                localField: "role",
                foreignField: "_id",
                as: "role",
            },
        },
        {
            $unwind: {
                path: "$role",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $group: {
                _id: "$role.role",
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
        {
            $sort: {
                _id: 1,
            },
        },
    ]);
}

function listStaffWithWorkStates(hotel) {
    return Staff.aggregate([
        {
            $match: {
                isDeleted: false,
                hotel: mongoose.Types.ObjectId(hotel),
            },
        },
        {
            $lookup: {
                from: "roles",
                localField: "role",
                foreignField: "_id",
                as: "role",
            },
        },
        {
            $unwind: {
                path: "$role",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $group: {
                _id: "$workState",
                data: {
                    $push: {
                        _id: "$_id",
                        firstName: "$firstName",
                        lastName: "$lastName",
                        phoneNumber: "$phoneNumber",
                        status: "$status",
                        role: "$role",
                        joinedAt: "$joinDate",
                    },
                },
                count: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ]);
}

function listAllStaffs(hotel) {
    return Staff.find({
        isDeleted: false,
        hotel: mongoose.Types.ObjectId(hotel),
    }).populate("role");
}

function addRole(hotel, role) {
    return new Promise((resolve, reject) => {
        Role.findOne({ hotel: hotel, role: role })
            .then((response) => {
                if (response) {
                    console.log(response);
                    reject(new ErrorBody(401, "Role Already Exists"));
                } else {
                    return Role.create({ hotel: hotel, role: role });
                }
            })
            .then((response) => {
                return Hotel.findByIdAndUpdate(
                    mongoose.Types.ObjectId(hotel),
                    { $addToSet: { roles: response } },
                    { new: true }
                ).populate("roles");
            })
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                logger.error(
                    "Failed while adding role" +
                        JSON.stringify(error.message || error.errorMessage)
                );
                reject(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Server error occurred"
                    )
                );
            });
    });
}

function editRole(hotel, roleId, role) {
    return Role.findOneAndUpdate(
        {
            hotel: mongoose.Types.ObjectId(hotel),
            _id: mongoose.Types.ObjectId(roleId),
        },
        {
            $set: {
                role: role,
            },
        },
        { new: true }
    );
}

function listRoles(hotel) {
    return Role.find({ hotel: mongoose.Types.ObjectId(hotel) });
}

function searchStaff(hotel, searchBody) {
    const firstName = searchBody.firstName;
    return Staff.aggregate([
        {
            $match: {
                hotel: mongoose.Types.ObjectId(hotel),
                $or: [
                    {
                        firstName: {
                            $regex: firstName,
                            $options: "i",
                        },
                    },
                    ...(searchBody.lastName && [
                        {
                            lastName: {
                                $regex: searchBody.lastName,
                                $options: "i",
                            },
                        },
                    ]),
                ],
                isDeleted: false,
            },
        },
        {
            $lookup: {
                from: "roles",
                localField: "role",
                foreignField: "_id",
                as: "role",
            },
        },
        {
            $unwind: {
                path: "$role",
                preserveNullAndEmptyArrays: true,
            },
        },
    ]);
}

module.exports = {
    addRole: addRole,
    editRole: editRole,
    listRoles: listRoles,
    addStaff: addStaff,
    editStaff: editStaff,
    searchStaff: searchStaff,
    removeStaff: removeStaff,
    listAllStaffs: listAllStaffs,
    listStaffWithRoles: listStaffWithRoles,
    listStaffWithStatus: listStaffWithStatus,
    listStaffWithWorkStates: listStaffWithWorkStates,
};
