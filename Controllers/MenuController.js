const MenuService = require("../Services/MenuService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

function createMenu(req, res, next) {
    const { hotelId } = req.params;
    MenuService.createMenu(hotelId)
        .then((response) => {
            res.status(200);
            res.json({
                data: response,
                message: "Menu Created Successfully",
            });
        })
        .catch((error) => {
            logger.error("Failed in create Menu: " + JSON.stringify(error));
            next(
                new ErrorBody(
                    error.statusCode || 500,
                    error.errorMessage || "Internal Server Error"
                )
            );
        });
}

function addCategoryToMenu(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in register Hotel request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        MenuService.addCategoryToMenu(req.body)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Category Added to Menu Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in add Category to Menu: " + JSON.stringify(error)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function searchCategory(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in search category request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { categoryName, menuId } = req.body;
        MenuService.searchCategory(categoryName, menuId)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Category Fetched Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in search Category: " + JSON.stringify(error)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function searchMenuItem(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in search menu Item request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { itemName, menuId } = req.body;
        MenuService.searchMenuItem(itemName, menuId)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Items Fetched Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in search menu item: " + JSON.stringify(error)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function editCategory(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in edit category request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { categoryId, ...reqBody } = req.body;
        MenuService.editCategory(reqBody, categoryId)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Category Updated Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in edit Category: " + JSON.stringify(error)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function addItemToMenu(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in add menuitem request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        MenuService.addItemToMenu(req.body)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "item added Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in add menu item: " + JSON.stringify(error)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function editMenuItem(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in edit menuitem request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { itemId, ...reqBody } = req.body;
        MenuService.editMenuItem(itemId, reqBody)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "item updated Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in edit menu item: " + JSON.stringify(error)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function listCategoryWithItemCount(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in list category request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { menuId } = req.body;
        MenuService.listCategoryWithItemCount(menuId)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Categories Fetched Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in list category item: " + JSON.stringify(error)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function listMenuItem(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in list menu items request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { menuId } = req.body;
        MenuService.listMenuItem(menuId)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Items Fetched Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in list menu items item: " + JSON.stringify(error)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function filterMenuByType(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error(
            "Error in filter menu items by type request body: ",
            JSON.stringify(errors)
        );
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { menuId, type } = req.body;
        MenuService.filterMenuByType(menuId, type)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Items Fetched Successfully",
                });
            })
            .catch((error) => {
                console.log(error);
                logger.error(
                    "Failed in filter menu items by type: " +
                        JSON.stringify(error)
                );
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

module.exports = {
    createMenu: createMenu,
    addCategoryToMenu: addCategoryToMenu,
    listCategoryWithItemCount: listCategoryWithItemCount,
    searchCategory: searchCategory,
    searchMenuItem: searchMenuItem,
    editCategory: editCategory,
    addItemToMenu: addItemToMenu,
    editMenuItem: editMenuItem,
    listMenuItem: listMenuItem,
    filterMenuByType: filterMenuByType,
};
