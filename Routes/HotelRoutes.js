const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const hotelController = require("../Controllers/HotelController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.post(
    "/get",
    [body("hotelId").notEmpty()],
    verifyToken,
    hotelController.getHotelById
);

router.post(
    "/callout",
    [body("hotelId").notEmpty()],
    verifyToken,
    hotelController.dashboardCallouts
);

router.post(
    "/register",
    [
        body("name").notEmpty(),
        body("phoneNumber").isMobilePhone(),
        body("email").notEmpty(),
        body("password").notEmpty(),
    ],
    hotelController.registerHotel
);

router.post(
    "/login",
    [body("email").notEmpty(), body("password").notEmpty()],
    hotelController.loginHotel
);

router.post(
    "/verifyOtp",
    [body("phoneNumber").isMobilePhone(), body("otp").isNumeric()],
    hotelController.verifyOtp
);

router.post(
    "/onboard",
    [body("hotelId").notEmpty()],
    verifyToken,
    hotelController.onBoardHotel
);

module.exports = router;
