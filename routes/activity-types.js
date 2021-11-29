const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { addActivityType, markToDo, unmarkToDo, togglePriority, deleteActivityType } = require("../controllers/activity-types");

router.post("/", catchAsync(addActivityType))

router.put("/:typeId/mark-to-do", catchAsync(markToDo))

router.put("/:typeId/unmark-to-do", catchAsync(unmarkToDo))

router.put("/:typeId/toggle-priority", catchAsync(togglePriority))

router.delete("/:typeId", catchAsync(deleteActivityType))

module.exports = router;