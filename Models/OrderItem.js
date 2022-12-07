const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
    {
        menuItem: {
            type: Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
        },
        quantity: {
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
    model: mongoose.model("OrderItem", OrderItemSchema),
    schema: OrderItemSchema,
};
