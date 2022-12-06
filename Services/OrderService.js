const { default: mongoose } = require("mongoose");
const Rating = require("../Models/Rating").model;
const Guest = require("../Models/Guest").model;
const Order = require("../Models/Order").model;
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

function createOrder(reqBody) {
    return Order.findByIdAndUpdate(mongoose.Types.ObjectId(), reqBody, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
    }).populate(["room", "staff", "guest", "staff", "orderItems.menuItem"]);
}

function editOrder(orderId, reqBody) {
    return Order.findByIdAndUpdate(
        mongoose.Types.ObjectId(orderId),
        { $set: reqBody },
        {
            new: true,
        }
    ).populate(["room", "staff", "guest", "staff", "orderItems.menuItem"]);
}

function listOrder(hotel, isService) {
    return Order.find({
        hotel: hotel,
        isService: isService,
        isDeleted: false,
    }).populate(["room", "staff", "guest", "staff", "orderItems.menuItem"]);
}

function rateOrder(orderId, rating, isService) {
    return new Promise((resolve, reject) => {
        let guestId;
        let _responseBody;
        // update order object
        Order.findByIdAndUpdate(
            mongoose.Types.ObjectId(orderId),
            { $set: { rating: rating } },
            { new: true }
        )
            .then((order) => {
                // get guest from order
                _responseBody = {
                    order: order,
                };
                guestId = order.guest;
                return Guest.findById(guestId).populate("ratings");
            })
            .then((guest) => {
                // update rating Object
                let rate;
                if (isService) {
                    let serviceRating = guest.ratings.find(
                        (rating) => rating.type == "SPA, Massage, Salon"
                    );
                    rate = serviceRating;
                } else {
                    let foodRating = guest.ratings.find(
                        (rating) => rating.type == "Food"
                    );
                    rate = foodRating;
                }
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
                logger.error("Failed in rate order: " + error.message);
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
    createOrder: createOrder,
    editOrder: editOrder,
    listOrder: listOrder,
    rateOrder: rateOrder,
};
