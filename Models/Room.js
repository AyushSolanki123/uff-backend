const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
	{
		hotel: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},
		number: {
			type: Schema.Types.Number,
			required: true,
		},
		type: {
			type: Schema.Types.String,
			required: true,
		},
		status: {
			type: Schema.Types.String,
			required: true,
			enum: ["AVAILABLE", "NEEDS_CLEANING", "UNDER_CLEANING", "OCCUPIED"],
			default: "AVAILABLE",
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
	model: mongoose.model("Room", RoomSchema),
};
