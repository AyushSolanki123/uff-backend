const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
	{
		menu: {
			type: Schema.Types.ObjectId,
			ref: "Menu",
			required: true,
		},
		name: {
			type: Schema.Types.String,
			required: true,
		},
		description: {
			type: Schema.Types.String,
			required: false,
			default: "",
		},
		isAvailable: {
			type: Schema.Types.Boolean,
			required: true,
			default: true,
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
	model: mongoose.model("Category", CategorySchema),
};
