const TaskService = require("../Services/TaskService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

function createTask(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error("Error in create Task request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        TaskService.createTask(req.body)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Task Created Successfully",
                });
            })
            .catch((error) => {
                logger.error("Failed in create task: " + JSON.stringify(error));
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function editTask(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error("Error in edit Task request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { taskId, ...reqBody } = req.body;
        TaskService.editTask(taskId, reqBody)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Task Updated Successfully",
                });
            })
            .catch((error) => {
                logger.error("Failed in edit task: " + JSON.stringify(error));
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Internal Server Error"
                    )
                );
            });
    }
}

function listCompletedTasks(req, res, next) {
    const { hotelId } = req.params;
    TaskService.listCompletedTasks(hotelId)
        .then((response) => {
            res.status(200);
            res.json({
                data: response,
                message: "Task Fetched Successfully",
            });
        })
        .catch((error) => {
            logger.error(
                "Failed in list completed task: " + JSON.stringify(error)
            );
            next(
                new ErrorBody(
                    error.statusCode || 500,
                    error.errorMessage || "Internal Server Error"
                )
            );
        });
}

function listDashboardTasks(req, res, next) {
    const { hotelId } = req.params;
    TaskService.listDashboardTasks(hotelId)
        .then((response) => {
            res.status(200);
            res.json({
                data: response,
                message: "Task Fetched Successfully",
            });
        })
        .catch((error) => {
            logger.error(
                "Failed in list dashboard task: " + JSON.stringify(error)
            );
            next(
                new ErrorBody(
                    error.statusCode || 500,
                    error.errorMessage || "Internal Server Error"
                )
            );
        });
}

module.exports = {
    createTask: createTask,
    editTask: editTask,
    listCompletedTasks: listCompletedTasks,
    listDashboardTasks: listDashboardTasks,
};
