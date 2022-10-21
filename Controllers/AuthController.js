const UserService = require("../Services/UserService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");
const { generateAuthPairs, validateAuthToken } = require("../Utils/Helper");
const otpGenerator = require("otp-generator");
const moment = require("moment");

function registerUser(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in register: ", errors);
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		const { firstName, phoneNumber } = req.body;
		UserService.getUserByMobile(phoneNumber)
			.then((userResponse) => {
				if (userResponse) {
					throw new ErrorBody(
						401,
						"The user already exists in the system, please login"
					);
				} else {
					const _otp = otpGenerator.generate(6, {
						specialChars: false,
						upperCaseAlphabets: false,
						lowerCaseAlphabets: false,
					});
					const _otpValidMoment = moment();
					_otpValidMoment.add(1, "day");
					const _userBody = {
						firstName: firstName,
						...(req.body.lastName && {
							lastName: req.body.lastName,
						}),
						phoneNumber: phoneNumber,
						...(req.body.email && { email: req.body.email }),
						otp: _otp,
						otpValidity: _otpValidMoment.valueOf(),
					};
					return UserService.addUser(_userBody);
				}
			})
			.then((response) => {
				//TODO: Send SMS to registered user to verify phone Number
				res.status(201);
				res.json({
					message: "User Registered Successfully",
					data: response,
				});
			})
			.catch((error) => {
				logger.error(
					"Failed while registering the user" +
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

function loginUser(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in logging in: ", JSON.stringify(errors));
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		const { phoneNumber } = req.body;
		let _user = null;
		UserService.getUserByMobile(phoneNumber)
			.then((user) => {
				if (user) {
					const _otp = otpGenerator.generate(6, {
						specialChars: false,
						upperCaseAlphabets: false,
						lowerCaseAlphabets: false,
					});
					const _otpValidMoment = moment();
					_otpValidMoment.add(1, "day");
					return UserService.updateUser(user._id, {
						otp: _otp,
						otpValidity: _otpValidMoment.valueOf(),
					});
				} else {
					throw new ErrorBody(
						401,
						"The user Doesnt exists in the system, please Register"
					);
				}
			})
			.then((response) => {
				// TODO: Send and verify OTP to user for login
				if (response) {
					_user = response;
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
					throw new ErrorBody(
						401,
						"Wrong password entered, please retry"
					);
				}
			})
			.then((tokenPair) => {
				res.status(200);
				res.json({
					message: "Login Successful",
					token: tokenPair,
					user: _user,
				});
			})
			.catch((error) => {
				logger.error(
					"Failed while registering the user" +
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

function verifyOTP(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in refresh token request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		const { phoneNumber, otp } = req.body;
		UserService.getUserByMobile(phoneNumber)
			.then((user) => {
				if (user) {
					if (user.otp == otp) {
						const authPayload = {
							phoneNumber: user.phoneNumber,
							type: "auth",
						};
						const refreshPayload = {
							phoneNumber: user.phoneNumber,
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

function resendOtp(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in refresh token request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		const { phoneNumber } = req.body;
		UserService.getUserByMobile(phoneNumber)
			.then((user) => {
				if (user) {
					const _otp = otpGenerator.generate(6, {
						specialChars: false,
						upperCaseAlphabets: false,
						lowerCaseAlphabets: false,
					});
					const _otpValidMoment = moment();
					_otpValidMoment.add(1, "day");
					return UserService.updateUser(user._id, {
						otp: _otp,
						otpValidity: _otpValidMoment.valueOf(),
					});
				} else {
					throw new ErrorBody(
						401,
						"The user Doesnt exists in the system, please Register"
					);
				}
			})
			.then((response) => {
				// TODO: Send OTP to user
				res.status(200);
				res.json({
					data: {
						otp: response.otp,
						otpValidity: response.otpValidity,
					},
					message: "OTP",
				});
			})
			.catch((error) => {
				logger.error("Failed in resend OTP" + JSON.stringify(error));
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Internal Server Error"
					)
				);
			});
	}
}

function refreshToken(req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		logger.error("Error in refresh token request body");
		next(new ErrorBody(400, "Invalid values in the form"));
	} else {
		const refreshToken = req.body.refreshToken;
		validateAuthToken(refreshToken, 1)
			.then((response) => {
				console.log("Refresh token response");
				console.log(response);
				if (response.iat) {
					delete response.iat;
				}
				return generateAuthPairs(response, response);
			})
			.then((tokenPair) => {
				res.status(200);
				res.json({
					authToken: tokenPair.authToken,
				});
			})
			.catch((error) => {
				next(
					new ErrorBody(
						error.statusCode || 500,
						error.errorMessage || "Server error occurred"
					)
				);
			});
	}
}

module.exports = {
	loginUser: loginUser,
	registerUser: registerUser,
	refreshToken: refreshToken,
	verifyOTP: verifyOTP,
	resendOtp: resendOtp,
};
