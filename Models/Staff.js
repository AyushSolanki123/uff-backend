const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffSchema = new Schema(
	{
		hotel: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},
		firstName: {
			type: Schema.Types.String,
			required: true,
		},
		lastName: {
			type: Schema.Types.String,
			required: false,
		},
		role: {
			type: Schema.Types.ObjectId,
			ref: "Role",
			required: false,
			default: null,
		},
		phoneNumber: {
			type: Schema.Types.String,
			required: false,
		},
		status: {
			type: Schema.Types.String,
			required: true,
			enum: ["PENDING", "APPROVED"],
			default: "PENDING",
		},
		workState: {
			type: Schema.Types.String,
			required: true,
			enum: ["IDLE", "ENGAGED"],
			default: "IDLE",
		},
		joinDate: {
			type: Schema.Types.Date,
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

module.exports = {
	model: mongoose.model("Staff", StaffSchema),
};
