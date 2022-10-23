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
	model: mongoose.model("Staff", StaffSchema),
};
