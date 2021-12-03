const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { addActivityType, markToDo, unmarkToDo, togglePriority, togglePinned, deleteActivityType } = require("../controllers/activity-types");
const { isHouseholdMember } = require("../middleware");

router.post("/", catchAsync(isHouseholdMember), catchAsync(addActivityType))

router.put("/:typeId/mark-to-do", catchAsync(isHouseholdMember), catchAsync(markToDo))

router.put("/:typeId/unmark-to-do", catchAsync(isHouseholdMember), catchAsync(unmarkToDo))

router.put("/:typeId/toggle-priority", catchAsync(isHouseholdMember), catchAsync(togglePriority))

router.put("/:typeId/toggle-pinned", catchAsync(isHouseholdMember), catchAsync(togglePinned))

router.delete("/:typeId", catchAsync(isHouseholdMember), catchAsync(deleteActivityType))

module.exports = router;