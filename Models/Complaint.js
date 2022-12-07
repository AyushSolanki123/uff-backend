const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComplaintSchema = new Schema(
    {
        hotel: {
            type: Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
        },
        title: {
            type: Schema.Types.String,
            required: true,
        },
        description: {
            type: Schema.Types.String,
            required: false,
        },
        guest: {
            type: Schema.Types.ObjectId,
            ref: "Guest",
            required: true,
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        staff: {
            type: Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
        },
        status: {
            type: Schema.Types.String,
            required: true,
            enum: ["NEW", "RESOLVED"],
            default: "NEW",
        },
        rating: {
            type: Schema.Types.Number,
            required: false,
            default: 0,
            min: 0,
            max: 5,
        },
        timeToResolve: {
            type: Schema.Types.Number,
            required: false,
            default: 0,
            min: 0,
        },
        resolution: {
            type: Schema.Types.String,
            required: false,
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
    model: mongoose.model("Complaint", ComplaintSchema),
};
