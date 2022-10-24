const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
	{
		hotel: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},
		staffs: {
			type: [Schema.Types.ObjectId],
			ref: "Staff",
			required: false,
		},
		roles: {
			type: [Schema.Types.String],
			required: false,
		},
		inviteLink: {
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

module.exports = {
	model: mongoose.model("Room", RoomSchema),
};
