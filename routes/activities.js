const express = require("express");
const router = express.Router();
const activities = require("../controllers/activities");

router.post("/", activities.createActivity);

router.delete("/:activityId", activities.deleteActivity)

module.exports = router;