const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const orderController = require("../Controllers/OrderController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.post(
    "/create",
    [
        body("hotel").notEmpty(),
        body("number").isNumeric(),
        body("room").notEmpty(),
        body("guest").notEmpty(),
        body("orderItems").isArray(),
        body("amount").isNumeric(),
        body("staff").notEmpty(),
    ],
    verifyToken,
    orderController.createOrder
);

router.post(
    "/list",
    [body("hotel").notEmpty(), body("isService").isBoolean()],
    verifyToken,
    orderController.listOrder
);

router.post(
    "/rate",
    [
        body("orderId").notEmpty(),
        body("rating").isNumeric(),
        body("isService").isBoolean(),
    ],
    verifyToken,
    orderController.rateOrder
);

router.put(
    "/edit",
    [body("orderId").notEmpty()],
    verifyToken,
    orderController.editOrder
);

module.exports = router;
