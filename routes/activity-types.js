const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { addActivityType, toggleTodo, togglePriority, togglePinned, deleteActivityType } = require("../controllers/activity-types");
const { isHouseholdMember } = require("../middleware");

router.post("/", catchAsync(isHouseholdMember), catchAsync(addActivityType))

router.put("/:typeId/toggle-todo", catchAsync(isHouseholdMember), catchAsync(toggleTodo))

router.put("/:typeId/toggle-priority", catchAsync(isHouseholdMember), catchAsync(togglePriority))

router.put("/:typeId/toggle-pinned", catchAsync(isHouseholdMember), catchAsync(togglePinned))

router.delete("/:typeId", catchAsync(isHouseholdMember), catchAsync(deleteActivityType))

module.exports = router;