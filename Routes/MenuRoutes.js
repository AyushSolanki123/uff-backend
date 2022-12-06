const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const menuController = require("../Controllers/MenuController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.post(
    "/create/:hotelId",
    [body("hotelId").notEmpty()],
    verifyToken,
    menuController.createMenu
);

router.post(
    "/list/category",
    [body("menuId").notEmpty()],
    verifyToken,
    menuController.listCategoryWithItemCount
);

router.post(
    "/list/item",
    [body("menuId").notEmpty()],
    verifyToken,
    menuController.listMenuItem
);

router.post(
    "/filter/item",
    [body("menuId").notEmpty(), body("type").notEmpty()],
    verifyToken,
    menuController.filterMenuByType
);

router.post(
    "/category/create",
    [body("menu").notEmpty(), body("name").notEmpty()],
    verifyToken,
    menuController.addCategoryToMenu
);

router.post(
    "/item/create",
    [
        body("menu").notEmpty(),
        body("name").notEmpty(),
        body("category").notEmpty(),
        body("type").notEmpty(),
        body("price").isNumeric(),
        body("taxPercent").isNumeric(),
        body("prepTime").isNumeric(),
    ],
    verifyToken,
    menuController.addItemToMenu
);

router.post(
    "/search/category",
    [body("menuId").notEmpty(), body("categoryName").notEmpty()],
    verifyToken,
    menuController.searchCategory
);

router.post(
    "/search/item",
    [body("menuId").notEmpty(), body("itemName").notEmpty()],
    verifyToken,
    menuController.searchMenuItem
);

router.put(
    "/edit/category",
    [body("categoryId").notEmpty()],
    verifyToken,
    menuController.editCategory
);

router.put(
    "/edit/item",
    [body("itemId").notEmpty()],
    verifyToken,
    menuController.editMenuItem
);

module.exports = router;
