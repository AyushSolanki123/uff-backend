const ComplaintService = require("../Services/ComplaintService");
const { validationResult } = require("express-validator");
const ErrorBody = require("../Utils/ErrorBody");
const { logger } = require("../Utils/Logger");

function createComplaint(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error("Error in create compaint request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        ComplaintService.createComplaint(req.body)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Complaint created Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in create complaint: " + JSON.stringify(error)
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

function updateComplaint(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error("Error in update compaint request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { complaintId, ...reqBody } = req.body;
        ComplaintService.updateComplaint(complaintId, reqBody)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Complaint updated Successfully",
                });
            })
            .catch((error) => {
                logger.error(
                    "Failed in update complaint: " + JSON.stringify(error)
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

function resolveComplaint(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error("Error in resolve compaint request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { complaintId, timeToResolve, resolution } = req.body;
        ComplaintService.resolveComplaint(
            complaintId,
            timeToResolve,
            resolution
        )
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Complaint resolved Successfully",
                });
            })
            .catch((error) => {
                console.log(error.message);
                logger.error(
                    "Failed in resolve complaint: " + JSON.stringify(error)
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

function listComplaintFilteredByStatus(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error("Error in list compaint request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { hotelId } = req.body;
        ComplaintService.listComplaintFilteredByStatus(hotelId)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Complaints Fetched Successfully",
                });
            })
            .catch((error) => {
                console.log(error.message);
                logger.error(
                    "Failed in list complaint: " + JSON.stringify(error)
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

function listResolvedComplaints(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error("Error in list compaint request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { hotelId } = req.body;
        ComplaintService.listResolvedComplaints(hotelId)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Complaints Fetched Successfully",
                });
            })
            .catch((error) => {
                console.log(error.message);
                logger.error(
                    "Failed in list complaint: " + JSON.stringify(error)
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
function rateComplaint(req, res, next) {
    const { errors } = validationResult(req.body);
    if (errors.length > 0) {
        logger.error("Error in rate compaint request body");
        next(new ErrorBody(400, "Invalid values in the form"));
    } else {
        const { complaintId, rating } = req.body;
        ComplaintService.rateComplaint(complaintId, rating)
            .then((response) => {
                res.status(200);
                res.json({
                    data: response,
                    message: "Complaints Rated Successfully",
                });
            })
            .catch((error) => {
                console.log(error.message);
                logger.error(
                    "Failed in rate complaint: " + JSON.stringify(error)
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
    rateComplaint: rateComplaint,
    createComplaint: createComplaint,
    updateComplaint: updateComplaint,
    resolveComplaint: resolveComplaint,
    listResolvedComplaints: listResolvedComplaints,
    listComplaintFilteredByStatus: listComplaintFilteredByStatus,
};
