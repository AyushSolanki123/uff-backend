const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const taskController = require("../Controllers/TaskController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.get(
    "/list/completed/:hotelId",
    verifyToken,
    taskController.listCompletedTasks
);

router.get(
    "/list/dashboard/:hotelId",
    verifyToken,
    taskController.listDashboardTasks
);

router.post(
    "/create",
    [body("hotel").notEmpty(), body("title").notEmpty()],
    verifyToken,
    taskController.createTask
);

router.put(
    "/edit",
    [body("taskId").notEmpty()],
    verifyToken,
    taskController.editTask
);

module.exports = router;
