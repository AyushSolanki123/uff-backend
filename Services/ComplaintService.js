const { default: mongoose } = require("mongoose");
const Rating = require("../Models/Rating").model;
const Guest = require("../Models/Guest").model;
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");
const Staff = require("../Models/Staff").model;

const Complaint = require("../Models/Complaint").model;

function createComplaint(reqBody) {
    return new Promise((resolve, reject) => {
        const { staff } = reqBody;
        Staff.findByIdAndUpdate(
            mongoose.Types.ObjectId(staff),
            { $set: { workState: "ENGAGED" } },
            { new: true }
        )
            .then((staff) => {
                reqBody = Object.assign(reqBody, { staff: staff._id });
                return Complaint.findByIdAndUpdate(
                    mongoose.Types.ObjectId(),
                    reqBody,
                    {
                        new: true,
                        upsert: true,
                    }
                ).populate(["room", "staff", "guest"]);
            })
            .then((complaint) => {
                resolve(complaint);
            })
            .catch((error) => {
                logger.error("Failed in create Complaint: " + error.message);
                reject(
                    new ErrorBody(
                        error.status || 500,
                        error.message || "Internal Server Error"
                    )
                );
            });
    });
}

function updateComplaint(complaintId, reqBody) {
    return Complaint.findByIdAndUpdate(
        mongoose.Types.ObjectId(complaintId),
        { $set: reqBody },
        { new: true }
    ).populate(["room", "staff", "guest"]);
}

function resolveComplaint(complaintId, timeToResolve, resolution) {
    return new Promise((resolve, reject) => {
        let staff;
        Complaint.findById(mongoose.Types.ObjectId(complaintId))
            .then((complaint) => {
                staff = complaint.staff._id;
                return Staff.findByIdAndUpdate(
                    mongoose.Types.ObjectId(staff),
                    { $set: { workState: "IDLE" } },
                    { new: true }
                );
            })
            .then((staff) => {
                return Complaint.findByIdAndUpdate(
                    mongoose.Types.ObjectId(complaintId),
                    {
                        $set: {
                            status: "RESOLVED",
                            timeToResolve: timeToResolve,
                            resolution: resolution,
                        },
                    },
                    { new: true }
                ).populate(["room", "staff", "guest"]);
            })
            .then((complaint) => {
                resolve(complaint);
            })
            .catch((error) => {
                logger.error("Failed in resolve Complaint: " + error.message);
                reject(
                    new ErrorBody(
                        error.status || 500,
                        error.message || "Internal Server Error"
                    )
                );
            });
    });
}

function listComplaintFilteredByStatus(hotelId) {
    return Complaint.aggregate([
        {
            $match: {
                hotel: mongoose.Types.ObjectId(hotelId),
                isDeleted: false,
            },
        },
        {
            $lookup: {
                from: "rooms",
                localField: "room",
                foreignField: "_id",
                as: "room",
            },
        },
        {
            $lookup: {
                from: "staffs",
                localField: "staff",
                foreignField: "_id",
                as: "staff",
            },
        },
        {
            $lookup: {
                from: "guests",
                localField: "guest",
                foreignField: "_id",
                as: "guest",
            },
        },
        {
            $unwind: {
                path: "$staff",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $unwind: {
                path: "$room",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $unwind: {
                path: "$guest",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $group: {
                _id: "$status",
                complaints: {
                    $push: {
                        _id: "$_id",
                        title: "$title",
                        description: "$description",
                        room: "$room",
                        guest: "$guest",
                        staff: "$staff",
                        rating: "$rating",
                        timeToResolve: "$timeToResolve",
                        resolution: "$resolution",
                    },
                },
                count: {
                    $sum: 1,
                },
            },
        },
    ]);
}

function listResolvedComplaints(hotelId) {
    return Complaint.find({
        hotel: mongoose.Types.ObjectId(hotelId),
        status: "RESOLVED",
    }).populate(["room", "staff", "guest"]);
}

function rateComplaint(complaintId, rating) {
    return new Promise((resolve, reject) => {
        let guestId;
        let _responseBody;
        // update complaint object
        Complaint.findByIdAndUpdate(
            mongoose.Types.ObjectId(complaintId),
            { $set: { rating: rating } },
            { new: true }
        )
            .then((complaint) => {
                // get guest from complaint
                _responseBody = {
                    complaint: complaint,
                };
                guestId = complaint.guest;
                return Guest.findById(guestId).populate("ratings");
            })
            .then((guest) => {
                // update complaint Object
                console.log(guest);
                let rate = guest.ratings.find(
                    (rating) => rating.type == "Complaints addressal"
                );
                let ratingValue =
                    (rate.rating * rate.count + rating) / (rate.count + 1);

                let updateRate = {
                    rating: ratingValue,
                    count: rate.count + 1,
                };
                return Rating.findByIdAndUpdate(
                    rate._id,
                    { $set: updateRate },
                    { new: true }
                );
            })
            .then((rating) => {
                return Guest.findById(guestId).populate("ratings");
            })
            .then((guest) => {
                _responseBody.ratings = guest.ratings;
                resolve(_responseBody);
            })
            .catch((error) => {
                logger.error("Failed in rate complaint: " + error.message);
                reject(
                    new ErrorBody(
                        error.status || 500,
                        error.message || "Internal Server Error"
                    )
                );
            });
    });
}

module.exports = {
    rateComplaint: rateComplaint,
    createComplaint: createComplaint,
    updateComplaint: updateComplaint,
    resolveComplaint: resolveComplaint,
    listResolvedComplaints: listResolvedComplaints,
    listComplaintFilteredByStatus: listComplaintFilteredByStatus,
};
