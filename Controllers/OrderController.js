const OrderService = require("../Services/OrderService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

function createOrder(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in create order request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        OrderService.createOrder(req.body)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Order Created Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in create Order: " + JSON.stringify(error)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function editOrder(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in edit order request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { orderId, ...reqBody } = req.body;
        OrderService.editOrder(orderId, reqBody)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Order Updated Successfully",
                });
            })
            .catch((error) => {
                logger.error("Failed in edit Order: " + JSON.stringify(error));
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function listOrder(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in list order request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { hotel, isService } = req.body;
        OrderService.listOrder(hotel, isService)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Order Feteched Successfully",
                });
            })
            .catch((error) => {
                logger.error("Failed in list Order: " + JSON.stringify(error));
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function rateOrder(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in rate order request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { orderId, rating, isService } = req.body;
        OrderService.rateOrder(orderId, rating, isService)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Order Rated Successfully",
                });
            })
            .catch((error) => {
                logger.error("Failed in rate Order: " + JSON.stringify(error));
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

module.exports = {
    createOrder: createOrder,
    editOrder: editOrder,
    listOrder: listOrder,
    rateOrder: rateOrder,
};
