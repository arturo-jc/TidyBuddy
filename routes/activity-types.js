const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { addActivityType, markToDo, unmarkToDo, togglePriority, deleteActivityType } = require("../controllers/activity-types");
const { isHouseholdMember } = require("../middleware");

router.post("/", isHouseholdMember, catchAsync(addActivityType))

router.put("/:typeId/mark-to-do", isHouseholdMember, catchAsync(markToDo))

router.put("/:typeId/unmark-to-do", isHouseholdMember, catchAsync(unmarkToDo))

router.put("/:typeId/toggle-priority", isHouseholdMember, catchAsync(togglePriority))

router.delete("/:typeId", isHouseholdMember, catchAsync(deleteActivityType))

module.exports = router;