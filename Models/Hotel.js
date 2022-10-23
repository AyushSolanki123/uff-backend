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
	model: mongoose.model("Hotel", HotelSchema),
};
