const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		firstName: {
			type: Schema.Types.String,
			required: true,
		},
		lastName: {
			type: Schema.Types.String,
			required: false,
		},
		email: {
			type: Schema.Types.String,
			required: false,
		},
		phoneNumber: {
			type: Schema.Types.String,
			required: true,
		},
		otp: {
			type: Schema.Types.String,
		},
		otpValidity: {
			type: Schema.Types.Number,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

module.exports = {
	model: mongoose.model("User", UserSchema),
};
