const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Routes
const routes = require("./Routes/index");
const { logger } = require("./Utils/Logger");

app.use(express.json());
app.use(cors());

app.use("/", routes);

// Global Error Handler
app.use("/", (err, req, res, next) => {
	logger.error("Error occurred");
	logger.log(JSON.stringify(err));
	logger.error(err.errorMessage || "Server error occurred");
	res.status(err.statusCode || 500);
	res.json({ errorMessage: err.errorMessage || "Server error occurred" });
});

mongoose.connect(process.env.MONGO_DB_STRING, {}, (err) => {
	if (err) {
		logger.error("Unable to connect to mongodb");
		logger.error(err);
		return;
	}
	logger.log("Connected to mongodb successfully");
	app.listen(process.env.PORT, () => {
		logger.log(`Server started at port ${process.env.PORT}`);
	});
});
