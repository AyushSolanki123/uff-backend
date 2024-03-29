const HotelService = require("../Services/HotelService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const bcrypt = require("bcrypt");
const { logger } = require("../Utils/Logger");
const { generateAuthPairs, validateAuthToken } = require("../Utils/Helper");
const otpGenerator = require("otp-generator");
const moment = require("moment");
const MenuService = require("../Services/MenuService");

function registerHotel(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in register Hotel request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { name, phoneNumber, email, password } = req.body;
        let _responseBody = {};
        HotelService.getHotelbyEmail(email)
            .then((hotel) => {
                if (hotel) {
                    throw new ErrorBody(
                        401,
                        "The hotel already exists, please login again"
                    );
                } else {
                    // uncomment in case of otp verification

                    // const _otp = otpGenerator.generate(6, {
                    //     specialChars: false,
                    //     upperCaseAlphabets: false,
                    //     lowerCaseAlphabets: false,
                    // });
                    // const _otpValidMoment = moment();
                    // _otpValidMoment.add(1, "day");
                    // const reqBody = {
                    //     name: name,
                    //     phoneNumber: phoneNumber,
                    //     otp: _otp,
                    //     otpValidity: _otpValidMoment.valueOf(),
                    // };

                    return bcrypt.hash(password, 10);
                }
            })
            .then((password) => {
                const reqBody = {
                    name: name,
                    phoneNumber: phoneNumber,
                    email: email,
                    password: password,
                };

                return HotelService.registerHotel(reqBody);
            })
            .then((response) => {
                _responseBody = Object.assign(_responseBody, {
                    hotel: response,
                });
                console.log(response._id);
                return MenuService.createMenu(response._id);
            })
            .then((response) => {
                //TODO: Send SMS to registered user to verify phone Number
                _responseBody = Object.assign(_responseBody, {
                    menu: response,
                });
                res.status(200);
                res.json({
                    data: _responseBody,
                    message: "Hotel registered Successfully",
                });
            })
            .catch((error) => {
                console.log(error);
                logger.error(
                    "Failed in register Hotel: " + JSON.stringify(error)
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

function loginHotel(req, res, next) {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        logger.error("Error in logging hotel in: ", JSON.stringify(errors));
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { email, password } = req.body;
        let _hotel = null;
        HotelService.getHotelbyEmail(email)
            .then((hotel) => {
                if (hotel) {
                    _hotel = hotel;
                    return bcrypt.compare(password, hotel.password);
                } else {
                    throw new ErrorBody(
                        401,
                        "The Hotel Doesnt exists in the system, please Register"
                    );
                }
            })
            .then((response) => {
                // TODO: Send and verify OTP to user for login in case of OTP
                if (response) {
                    const authPayload = {
                        email: email,
                        password: password,
                        type: "auth",
                    };
                    const refreshPayload = {
                        email: email,
                        password: password,
                        type: "refresh",
                    };
                    return generateAuthPairs(authPayload, refreshPayload);
                } else {
                    throw new ErrorBody(401, "Wrong OTP entered, please retry");
                }
            })
            .then((tokenPair) => {
                res.status(200);
                res.json({
                    message: "Login Successful",
                    token: tokenPair,
                    hotel: _hotel,
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed while logging in the hotel" +
                        JSON.stringify(error.message)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Server error occurred"
                    )
                );
            });
    }
}

function verifyOtp(req, res, next) {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        logger.error("Error in verify OTP hotel request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { phoneNumber, otp } = req.body;
        HotelService.getHotelbyPhoneNumber(phoneNumber)
            .then((hotel) => {
                if (hotel) {
                    if (hotel.otp == otp) {
                        const authPayload = {
                            phoneNumber: hotel.phoneNumber,
                            type: "auth",
                        };
                        const refreshPayload = {
                            phoneNumber: hotel.phoneNumber,
                            type: "refresh",
                        };
                        return generateAuthPairs(authPayload, refreshPayload);
                    } else {
                        throw new ErrorBody(
                            401,
                            "Wrong OTP entered, please retry"
                        );
                    }
                } else {
                    throw new ErrorBody(
                        401,
                        "The user Doesnt exists in the system, please Register"
                    );
                }
            })
            .then((tokenPair) => {
                res.status(200);
                res.json({
                    tokenPair: tokenPair,
                    message: "OTP Verified",
                });
            })
            .catch((error) => {
                logger.error("Failed in verify OTP" + JSON.stringify(error));
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Server error occurred"
                    )
                );
            });
    }
}

function onBoardHotel(req, res, next) {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        logger.error("Error in onBoard hotel request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { hotelId } = req.body;

        HotelService.onBoardHotel(hotelId, req.body)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Hotel onboarded Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in onboard Hotel: " + JSON.stringify(error)
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

function getHotelById(req, res, next) {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        logger.error("Error in get hotel request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { hotelId } = req.body;
        HotelService.getHotelById(hotelId)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Hotel fecthed Successfully",
                });
            })
            .catch((error) => {
                logger.error("Failed in get Hotel: " + JSON.stringify(error));
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function dashboardCallouts(req, res, next) {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        logger.error("Error in get dashbaord callouts request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { hotelId } = req.body;
        HotelService.dashboardCallouts(hotelId)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Callouts fetched Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in dashboard Callouts: " + JSON.stringify(error)
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

module.exports = {
    registerHotel: registerHotel,
    loginHotel: loginHotel,
    onBoardHotel: onBoardHotel,
    verifyOtp: verifyOtp,
    getHotelById: getHotelById,
    dashboardCallouts: dashboardCallouts,
};
