const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { createActivity, deleteActivity } = require("../controllers/activities");

router.post("/", catchAsync(createActivity));

router.delete("/:activityId", catchAsync(deleteActivity))

module.exports = router;