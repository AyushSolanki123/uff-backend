const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const complaintController = require("../Controllers/ComplaintController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.post(
    "/create",
    [
        body("title").notEmpty(),
        body("room").notEmpty(),
        body("hotel").notEmpty(),
        body("staff").notEmpty(),
    ],
    verifyToken,
    complaintController.createComplaint
);

router.put(
    "/update",
    [body("complaintId").notEmpty()],
    verifyToken,
    complaintController.updateComplaint
);

router.post(
    "/resolve",
    [
        body("complaintId").notEmpty(),
        body("timeToResolve").isNumeric(),
        body("resolution").notEmpty(),
    ],
    verifyToken,
    complaintController.resolveComplaint
);

router.post(
    "/list",
    [body("hotelId").notEmpty()],
    verifyToken,
    complaintController.listComplaintFilteredByStatus
);

router.post(
    "/list/resolved",
    [body("hotelId").notEmpty()],
    verifyToken,
    complaintController.listResolvedComplaints
);

router.post(
    "/rate",
    [body("complaintId").notEmpty(), body("rating").isNumeric()],
    verifyToken,
    complaintController.rateComplaint
);

module.exports = router;
