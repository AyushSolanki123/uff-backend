const ErrorBody = require("./ErrorBody");
const { logger } = require("./Logger");
import { getAuth, signInWithPhoneNumber } from "firebase/auth";

const auth = getAuth();
auth.languageCode = "it";
function sendOtp(phoneNumber, otp) {
	signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);

	return new Promise((resolve, reject) => {});
}

module.exports = {
	sendOtp: sendOtp,
};
