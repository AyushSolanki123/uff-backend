const { default: mongoose } = require("mongoose");
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

module.exports = {
	createTask: createTask,
	editTask: editTask,
	listCompletedTasks: listCompletedTasks,
};
