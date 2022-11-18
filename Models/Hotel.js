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
			required: false,
		},
		roles: {
			// Hotel will have their own roles
			type: [Schema.Types.ObjectId],
			ref: "Role",
			required: false,
		},
		inviteLink: {
			type: Schema.Types.String,
			required: true,
			default: "http://localhost:5000/api/v1",
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
