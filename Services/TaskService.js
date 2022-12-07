const { default: mongoose } = require("mongoose");
const { getHotelFoodAndServiceOrders } = require("./HotelService");
const Staff = require("../Models/Staff").model;
const Task = require("../Models/Task").model;

function createTask(reqBody) {
    return new Promise((resolve, reject) => {
        if (reqBody.staff) {
            Staff.findByIdAndUpdate(
                mongoose.Types.ObjectId(reqBody.staff),
                { $set: { workState: "ENGAGED" } },
                { new: true }
            ).then((staff) => {
                reqBody.staff = staff._id;
                resolve(Task.create(reqBody));
            });
        } else {
            resolve(Task.create(reqBody));
        }
    });
}

function editTask(taskId, reqBody) {
    return new Promise((resolve, reject) => {
        if (reqBody.status && reqBody.status == "RESOLVED") {
            Task.findById(mongoose.Types.ObjectId(taskId))
                .then((task) => {
                    return Staff.findByIdAndUpdate(
                        mongoose.Types.ObjectId(task.staff),
                        { $set: { workState: "IDLE" } },
                        { new: true }
                    );
                })
                .then((staff) => {
                    reqBody.staff = staff._id;
                    resolve(
                        Task.findByIdAndUpdate(
                            mongoose.Types.ObjectId(taskId),
                            { $set: reqBody },
                            { new: true }
                        )
                            .populate(["room", "staff"])
                            .populate({
                                path: "staff",
                                populate: { path: "role" },
                            })
                    );
                });
        } else {
            resolve(
                Task.findByIdAndUpdate(
                    mongoose.Types.ObjectId(taskId),
                    { $set: reqBody },
                    { new: true }
                )
                    .populate(["room", "staff"])
                    .populate({ path: "staff", populate: { path: "role" } })
            );
        }
    });
}

function listCompletedTasks(hotel) {
    return Task.find({
        hotel: mongoose.Types.ObjectId(hotel),
        status: "RESOLVED",
    })
        .populate(["room", "staff"])
        .populate({ path: "staff", populate: { path: "role" } });
}

function listDashboardTasks(hotel) {
    return new Promise((resolve, reject) => {
        let _responseBody;
        Task.find({
            hotel: mongoose.Types.ObjectId(hotel),
            isDeleted: false,
        })
            .populate(["room", "staff"])
            .populate({ path: "staff", populate: { path: "role" } })
            .then((tasks) => {
                _responseBody = {
                    rooms: tasks,
                };
                return getHotelFoodAndServiceOrders(hotel);
            })
            .then((response) => {
                let food = response[1].orders;
                let service = response[0].orders;
                _responseBody.food = food;
                _responseBody.service = service;
                resolve(_responseBody);
            })
            .catch((error) => {
                logger.error("Failed in dashboard tasks: " + error.message);
                reject(
                    new ErrorBody(
                        error.status || 500,
                        error.message || "Internal Server Error"
                    )
                );
            });
    });
}

module.exports = {
    createTask: createTask,
    editTask: editTask,
    listDashboardTasks: listDashboardTasks,
    listCompletedTasks: listCompletedTasks,
};
