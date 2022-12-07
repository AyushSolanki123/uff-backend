const router = require("express").Router();

router.use("/api/v1/auth", require("./AuthRoutes"));
router.use("/api/v1/menu", require("./MenuRoutes"));
router.use("/api/v1/room", require("./RoomRoutes"));
router.use("/api/v1/task", require("./TaskRoutes"));
router.use("/api/v1/user", require("./UserRoutes"));
router.use("/api/v1/hotel", require("./HotelRoutes"));
router.use("/api/v1/guest", require("./GuestRoutes"));
router.use("/api/v1/order", require("./OrderRoutes"));
router.use("/api/v1/staff", require("./StaffRoutes"));
router.use("/api/v1/complaint", require("./ComplaintRoutes"));

router.get("/", (req, res) => {
    res.redirect("/api/v1");
});

module.exports = router;
