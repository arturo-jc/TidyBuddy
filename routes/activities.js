const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { createActivity, deleteActivity } = require("../controllers/activities");
const { isHouseholdMember, ownsActivity } = require("../middleware");

router.post("/", catchAsync(isHouseholdMember), catchAsync(createActivity));

router.delete("/:activityId", catchAsync(ownsActivity), catchAsync(deleteActivity))

module.exports = router;