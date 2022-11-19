const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuSchema = new Schema(
	{
		hotel: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},
		categories: {
			type: [Schema.Types.ObjectId],
			ref: "Category",
			required: false,
			default: null,
		},
		items: {
			type: [Schema.Types.ObjectId],
			ref: "MenuItem",
			required: false,
			default: null,
		},
		isService: {
			type: Schema.Types.Boolean,
			required: true,
			default: false,
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
	model: mongoose.model("Menu", MenuSchema),
};
