const { default: mongoose } = require("mongoose");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");
const Rating = require("../Models/Rating").model;

const Guest = require("../Models/Guest").model;

function createGuest(reqBody) {
    return new Promise((resolve, reject) => {
        const ratingTypes = [
            "Food",
            "Room Service",
            "Cleanliness",
            "SPA, Massage, Salon",
            "Complaints addressal",
        ];
        let _promiseArray = [];
        ratingTypes.forEach((type) => {
            const rating = createDefaultRatingsForGuest(type);
            _promiseArray.push(rating);
        });
        Promise.all(_promiseArray)
            .then((ratings) => {
                reqBody = Object.assign(reqBody, { ratings: ratings });
                return Guest.findByIdAndUpdate(
                    mongoose.Types.ObjectId(),
                    reqBody,
                    {
                        new: true,
                        upsert: true,
                        runValidators: true,
                        setDefaultsOnInsert: true,
                    }
                ).populate(["hotel", "rooms", "ratings"]);
            })
            .then((guest) => {
                resolve(guest);
            })
            .catch((error) => {
                logger.error("Failed in create guest" + error.message);
                reject(
                    new ErrorBody(
                        error.status || 500,
                        error.message || "Internal Server Error"
                    )
                );
            });
    });
}

function createDefaultRatingsForGuest(type) {
    return Rating.create({
        type: type,
        rating: 0,
    });
}

function listGuestFilteredByStatus(hotelId, status, skip, limit) {
    return Guest.aggregate([
        {
            $match: {
                hotel: mongoose.Types.ObjectId(hotelId),
                status: status,
                isDeleted: false,
            },
        },
        {
            $lookup: {
                from: "rooms",
                localField: "rooms",
                foreignField: "_id",
                as: "rooms",
            },
        },
        {
            $unset: [
                "ratings",
                "phoneNumber",
                "amount",
                "balance",
                "discount",
                "guestType",
                "hotel",
                "idProof",
                "isDeleted",
                "otherCharges",
                "paymentType",
                "rooms.hotel",
                "rooms.rate",
            ],
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]);
}

function searchGuestByName(hotelId, name, skip, limit) {
    console.log(mongoose.Types.ObjectId(hotelId));
    return Guest.aggregate([
        {
            $match: {
                hotel: mongoose.Types.ObjectId(hotelId),
                name: {
                    $regex: name,
                    $options: "i",
                },
                isDeleted: false,
            },
        },
        {
            $lookup: {
                from: "rooms",
                localField: "rooms",
                foreignField: "_id",
                as: "rooms",
            },
        },
        {
            $unset: [
                "ratings",
                "phoneNumber",
                "amount",
                "balance",
                "discount",
                "guestType",
                "hotel",
                "idProof",
                "isDeleted",
                "otherCharges",
                "paymentType",
                "rooms.hotel",
                "rooms.rate",
            ],
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]);
}

function allotRoomToGuest(guestId, roomIds) {
    roomIds.map((roomId) => mongoose.Types.ObjectId(roomId));
    return Guest.findByIdAndUpdate(
        mongoose.Types.ObjectId(guestId),
        {
            $push: {
                rooms: {
                    $each: roomIds,
                },
            },
        },
        { new: true }
    ).populate("rooms");
}

function updateGuest(guestId, reqBody) {
    return Guest.findByIdAndUpdate(
        mongoose.Types.ObjectId(guestId),
        { $set: reqBody },
        {
            new: true,
        }
    );
}

module.exports = {
    createGuest: createGuest,
    listGuestFilteredByStatus: listGuestFilteredByStatus,
    searchGuestByName: searchGuestByName,
    allotRoomToGuest: allotRoomToGuest,
    updateGuest: updateGuest,
};
