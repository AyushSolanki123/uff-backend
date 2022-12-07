const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
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
        room: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        guest: {
            type: Schema.Types.ObjectId,
            ref: "Guest",
            required: true,
        },
        orderItems: {
            type: [Schema.Types.ObjectId],
            ref: "OrderItem",
            required: true,
        },
        amount: {
            type: Schema.Types.Number,
            required: true,
        },
        staff: {
            type: Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
        },
        isService: {
            type: Schema.Types.Boolean,
            required: false,
            default: false,
        },
        type: {
            type: Schema.Types.String,
            required: false,
            enum: ["NEW", "PROGRESS", "DONE"],
            default: "NEW",
        },
        foodStatus: {
            type: Schema.Types.String,
            required: false,
            enum: ["NEW", "PROGRESS", "READY", "DELIVERED"],
            default: "NEW",
        },
        serviceStatus: {
            type: Schema.Types.String,
            required: false,
            enum: ["NEW", "SCHEDULED", "PROGRESS", "DONE"],
            default: "NEW",
        },
        rating: {
            type: Schema.Types.Number,
            required: false,
            default: 0,
            min: 0,
            max: 5,
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
    model: mongoose.model("Order", OrderSchema),
};
