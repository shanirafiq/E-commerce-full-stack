const express = require("express");
const router = express.Router();
const { fetchUser, fetchAdmin } = require("../middleware/fetchUser");
const { getAdminDashboard, getAnalytics } = require("../controllers/analyticsController");

router.get("/dashboard", fetchUser, fetchAdmin, getAdminDashboard);
router.get("/analytics", fetchUser, getAnalytics);

module.exports = router;
