const HotelService = require("../Services/HotelService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");
const { generateAuthPairs, validateAuthToken } = require("../Utils/Helper");
const otpGenerator = require("otp-generator");
const moment = require("moment");

function registerHotel(req, res, next) {
	const { errors } = validationResult(req.body);
	if (errors.length > 0) {
		logger.error(
			"Error in register Hotel request body: ",
			JSON.stringify(errors)
		);
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		const { name, phoneNumber } = req.body;
		HotelService.getHotelbyPhoneNumber(phoneNumber)
			.then((hotel) => {
				if (hotel) {
					throw new ErrorBody(
						401,
						"The hotel already exists, please login again"
					);
				} else {
					const _otp = otpGenerator.generate(6, {
						specialChars: false,
						upperCaseAlphabets: false,
						lowerCaseAlphabets: false,
					});
					const _otpValidMoment = moment();
					_otpValidMoment.add(1, "day");
					const reqBody = {
						name: name,
						phoneNumber: phoneNumber,
						otp: _otp,
						otpValidity: _otpValidMoment.valueOf(),
					};
					return HotelService.registerHotel(reqBody);
				}
			})
			.then((response) => {
				//TODO: Send SMS to registered user to verify phone Number
				res.status(200);
				res.json({
					data: response,
					message: "Hotel registered Successfully",
				});
			})
			.catch((error) => {
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
		const { phoneNumber } = req.body;
		let _hotel = null;
		HotelService.getHotelbyPhoneNumber(phoneNumber)
			.then((hotel) => {
				if (hotel) {
					const _otp = otpGenerator.generate(6, {
						specialChars: false,
						upperCaseAlphabets: false,
						lowerCaseAlphabets: false,
					});
					const _otpValidMoment = moment();
					_otpValidMoment.add(1, "day");
					return HotelService.updateHotel(hotel._id, {
						otp: _otp,
						otpValidity: _otpValidMoment.valueOf(),
					});
				} else {
					throw new ErrorBody(
						401,
						"The Hotel Doesnt exists in the system, please Register"
					);
				}
			})
			.then((response) => {
				// TODO: Send and verify OTP to user for login
				if (response) {
					_hotel = response;
					const authPayload = {
						phoneNumber: response.phoneNumber,
						type: "auth",
					};
					const refreshPayload = {
						phoneNumber: response.phoneNumber,
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

module.exports = {
	registerHotel: registerHotel,
	loginHotel: loginHotel,
	onBoardHotel: onBoardHotel,
	verifyOtp: verifyOtp,
};
