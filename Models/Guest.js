const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuestTypeSchema = new Schema(
	{
		adults: {
			type: Schema.Types.Number,
			required: true,
			default: 0,
		},
		children: {
			type: Schema.Types.Number,
			required: true,
			default: 0,
		},
		isDeleted: {
			type: Schema.Types.Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const IDProofSchema = new Schema(
	{
		type: {
			type: Schema.Types.String,
			required: true,
		},
		url: {
			type: Schema.Types.String,
			required: true,
		},
		isDeleted: {
			type: Schema.Types.Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const OtherChargeSchema = new Schema(
	{
		type: {
			type: Schema.Types.String,
			required: true,
		},
		amount: {
			type: Schema.Types.Number,
			required: true,
		},
		isDeleted: {
			type: Schema.Types.Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const GuestSchema = new Schema(
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
		hotel: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},
		checkIn: {
			type: Schema.Types.Date,
			required: true,
		},
		checkOut: {
			type: Schema.Types.Date,
			required: true,
		},
		guestType: {
			type: GuestTypeSchema,
			required: true,
		},
		rooms: {
			type: [Schema.Types.ObjectId],
			ref: "Room",
			required: true,
		},
		amount: {
			type: Schema.Types.Number,
			required: true,
			default: 0,
			min: 0,
		},
		discount: {
			type: Schema.Types.Number,
			required: false,
			default: 0,
			min: 0,
		},
		idProof: {
			type: IDProofSchema,
			required: true,
		},
		status: {
			type: Schema.Types.String,
			required: true,
			enum: ["UPCOMING", "CHECKEDIN", "PAST"],
			default: "UPCOMING",
		},
		ratings: {
			type: [Schema.Types.ObjectId],
			ref: "Rating",
			required: false,
			default: null,
		},
		preCheckInDone: {
			type: Schema.Types.Boolean,
			required: true,
			default: false,
		},
		paymentType: {
			type: Schema.Types.String,
			required: true,
			enum: ["CASH", "UPI", "CARD"],
			default: "CASH",
		},
		balance: {
			type: Schema.Types.Number,
			required: false,
			default: 0,
		},
		otherCharges: {
			type: [OtherChargeSchema],
			required: false,
			default: null,
		},
		isDeleted: {
			type: Schema.Types.Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

module.exports = {
	model: mongoose.model("Guest", GuestSchema),
};
