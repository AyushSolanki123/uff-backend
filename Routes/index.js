const router = require("express").Router();

router.use("/api/v1/user", require("./UserRoutes"));
router.use("/api/v1/auth", require("./AuthRoutes"));
router.use("/api/v1/room", require("./RoomRoutes"));
router.use("/api/v1/hotel", require("./HotelRoutes"));
router.use("/api/v1/guest", require("./GuestRoutes"));
router.use("/api/v1/staff", require("./StaffRoutes"));

router.get("/", (req, res) => {
	res.redirect("/api/v1");
});

module.exports = router;
