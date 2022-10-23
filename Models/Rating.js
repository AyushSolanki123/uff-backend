const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema(
	{
		type: {
			type: Schema.Types.String,
			required: true,
		},
		rating: {
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

module.exports = {
	model: mongoose.model("Rating", RatingSchema),
};
