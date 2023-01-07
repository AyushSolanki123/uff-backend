const { default: mongoose } = require("mongoose");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");
const Order = require("../Models/Order").model;
const Guest = require("../Models/Guest").model;

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

function getHotelbyEmail(email) {
    return Hotel.findOne({ email: email, isDeleted: false });
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

function dashboardCallouts(hotel) {
    return new Promise((resolve, reject) => {
        let _responseBody;
        Guest.find({ hotel: mongoose.Types.ObjectId(hotel), isDeleted: false })
            .populate(["rooms", "ratings"])
            .then((guests) => {
                _responseBody = {
                    guest: {
                        data: guests,
                        count: guests.length,
                    },
                };
                return getHotelFoodAndServiceOrders(hotel);
            })
            .then((response) => {
                let food = response[1].orders;
                let service = response[0].orders;
                _responseBody.food = {
                    data: food,
                    count: food.length,
                };
                _responseBody.service = {
                    data: service,
                    count: service.length,
                };
                resolve(_responseBody);
            })
            .catch((error) => {
                logger.error("Failed in dashboard callouts: " + error.message);
                reject(
                    new ErrorBody(
                        error.status || 500,
                        error.message || "Internal Server Error"
                    )
                );
            });
    });
}

function getHotelFoodAndServiceOrders(hotelId) {
    return Order.aggregate([
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
            $unwind: {
                path: "$staff",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $group: {
                _id: "$isService",
                orders: {
                    $push: {
                        _id: "$_id",
                        amount: "$amount",
                        foodStatus: "$foodStatus",
                        number: "$number",
                        orderItems: "$orderItems",
                        rating: "$rating",
                        room: "$room",
                        serviceStatus: "$serviceStatus",
                        staff: "$staff",
                    },
                },
            },
        },
    ]);
}

module.exports = {
    registerHotel: registerHotel,
    onBoardHotel: onBoardHotel,
    updateHotel: updateHotel,
    getHotelById: getHotelById,
    dashboardCallouts: dashboardCallouts,
    getHotelbyEmail: getHotelbyEmail,
    getHotelbyPhoneNumber: getHotelbyPhoneNumber,
    getHotelFoodAndServiceOrders: getHotelFoodAndServiceOrders,
};
