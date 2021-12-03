const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { showActivities, createActivity, deleteActivity } = require("../controllers/activities");
const { isLoggedIn, isHouseholdMember, ownsActivity } = require("../middleware");

router.get("/", isLoggedIn, catchAsync(isHouseholdMember), catchAsync(showActivities))

router.post("/", catchAsync(isHouseholdMember), catchAsync(createActivity));

router.delete("/:activityId", catchAsync(ownsActivity), catchAsync(deleteActivity))

module.exports = router;