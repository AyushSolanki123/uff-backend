const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberSchema = new Schema(
    {
        mens: {
            type: Schema.Types.Number,
            required: true,
            default: 0,
        },
        womens: {
            type: Schema.Types.Number,
            required: true,
            default: 0,
        },
        children: {
            type: Schema.Types.Number,
            required: true,
            default: 0,
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

const MenuItemSchema = new Schema(
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
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category",
        },
        imageUrl: {
            type: Schema.Types.String,
            required: false,
            default: "",
        },
        price: {
            type: Schema.Types.Number,
            required: true,
        },
        taxPercent: {
            type: Schema.Types.Number,
            min: 0,
            max: 1,
            required: true,
        },
        type: {
            type: Schema.Types.String,
            required: false,
            enum: ["VEG", "NVEG", "EGG"],
            default: "VEG",
        },
        prepTime: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
        },
        member: {
            type: MemberSchema,
            required: false,
            default: null,
        },
        inBreakfast: {
            type: Schema.Types.Boolean,
            required: true,
            default: false,
        },
        inLunch: {
            type: Schema.Types.Boolean,
            required: true,
            default: false,
        },
        inDinner: {
            type: Schema.Types.Boolean,
            required: true,
            default: false,
        },
        isService: {
            type: Schema.Types.Boolean,
            required: true,
            default: false,
        },
        isSingle: {
            type: Schema.Types.Boolean,
            required: true,
            default: false,
        },
        isCouple: {
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
    model: mongoose.model("MenuItem", MenuItemSchema),
};
