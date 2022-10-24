const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HotelSchema = new Schema(
	{
		name: {
			type: Schema.Types.String,
			required: true,
		},
		email: {
			type: Schema.Types.String,
			required: false,
		},
		phoneNumber: {
			type: Schema.Types.String,
			required: true,
			unique: true,
		},
		otp: {
			type: Schema.Types.String,
		},
		onBoardingDone: {
			type: Schema.Types.Boolean,
			required: false,
			default: false,
		},
		otpValidity: {
			type: Schema.Types.Number,
		},
		isDeleted: {
			type: Schema.Types.Boolean,
			required: false,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

module.exports = {
	model: mongoose.model("Hotel", HotelSchema),
};
