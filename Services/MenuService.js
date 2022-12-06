const { default: mongoose } = require("mongoose");
const { add } = require("winston");
const Category = require("../Models/Category").model;
const Menu = require("../Models/Menu").model;
const MenuItem = require("../Models/MenuItem").model;
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

function createMenu(hotelId) {
    return new Promise((resolve, reject) => {
        let _responseBody = null;
        // create a Food menu
        // hotelId = mongoose.Types.ObjectId(hotelId)
        Menu.create({ hotel: hotelId })
            .then((menu) => {
                _responseBody = {
                    food: menu,
                };
                // create a Sevice Menu
                return Menu.create({ hotel: hotelId, isService: true });
            })
            .then((menu) => {
                _responseBody = Object.assign(_responseBody, { service: menu });
                resolve(_responseBody);
            })
            .catch((error) => {
                console.log(error);
                logger.error("Failed in create Menu:" + JSON.stringify(error));
                reject(
                    new ErrorBody(
                        error.status || 500,
                        error.message || "Internal server error"
                    )
                );
            });
    });
}

function addCategoryToMenu(reqBody) {
    return Category.create(reqBody);
}

function searchCategory(categoryName, menuId) {
    return Category.aggregate([
        {
            $match: {
                name: {
                    $regex: categoryName,
                    $options: "i",
                },
                menu: mongoose.Types.ObjectId(menuId),
                isDeleted: false,
            },
        },
    ]);
}

function listCategoryWithItemCount(menuId) {
    return MenuItem.aggregate([
        {
            $match: {
                menu: mongoose.Types.ObjectId(menuId),
                isDeleted: false,
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $group: {
                _id: "$category.name",
                items: {
                    $push: {
                        _id: "$_id",
                        name: "$name",
                        description: "$description",
                        isAvailable: "$isAvailable",
                        imageUrl: "$imageUrl",
                        price: "$price",
                        taxPercent: "$taxPercent",
                        type: "$type",
                        prepTime: "$prepTime",
                        member: "$member",
                        isService: "$isService",
                        inBreakfast: "$inBreakfast",
                        inLunch: "$inLunch",
                        inDinner: "$inDinner",
                        isSingle: "$isSingle",
                        isCouple: "$isCouple",
                    },
                },
                count: {
                    $sum: 1,
                },
            },
        },
    ]);
}

function editCategory(reqBody, categoryId) {
    return Category.findByIdAndUpdate(
        categoryId,
        { $set: reqBody },
        { new: true }
    );
}

function addItemToMenu(reqBody) {
    return MenuItem.create(reqBody);
}

function editMenuItem(itemId, reqBody) {
    return MenuItem.findByIdAndUpdate(
        itemId,
        { $set: reqBody },
        { new: true }
    ).populate("category");
}

function searchMenuItem(itemName, menuId) {
    return MenuItem.aggregate([
        {
            $match: {
                name: {
                    $regex: itemName,
                    $options: "i",
                },
                menu: mongoose.Types.ObjectId(menuId),
                isDeleted: false,
            },
        },
    ]);
}

function listMenuItem(menu) {
    return MenuItem.find({ menu: menu, isDeleted: false }).populate("category");
}

function filterMenuByType(menu, type) {
    return MenuItem.find({
        menu: mongoose.Types.ObjectId(menu),
        type: type,
        isDeleted: false,
    }).populate("category");
}

module.exports = {
    createMenu: createMenu,
    addCategoryToMenu: addCategoryToMenu,
    addItemToMenu: addItemToMenu,
    listCategoryWithItemCount: listCategoryWithItemCount,
    listMenuItem: listMenuItem,
    searchCategory: searchCategory,
    searchMenuItem: searchMenuItem,
    editCategory: editCategory,
    editMenuItem: editMenuItem,
    filterMenuByType: filterMenuByType,
};
