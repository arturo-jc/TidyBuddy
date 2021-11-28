const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { addActivityType, updateActivityType, deleteActivityType } = require("../controllers/activity-types");

router.post("/", catchAsync(addActivityType))

router.route("/:typeId")
    .put(catchAsync(updateActivityType))
    .delete(catchAsync(deleteActivityType))

module.exports = router;