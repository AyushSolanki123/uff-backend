const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema(
	{
		hotel: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},
		role: {
			type: Schema.Types.String,
			required: true,
		},
		count: {
			type: Schema.Types.Number,
			required: false,
			default: 0,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

module.exports = {
	model: mongoose.model("Role", RoleSchema),
};
