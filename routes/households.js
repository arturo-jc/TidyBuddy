const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { findHousehold, showHousehold, sendRequest, acceptRequest, declineRequest, createHousehold } = require("../controllers/households")

router.get("/find-or-create", catchAsync(findHousehold))

router.get("/:householdId", catchAsync(showHousehold))

router.put("/:householdId/send-request", catchAsync(sendRequest))

router.put("/:householdId/accept-request", catchAsync(acceptRequest))

router.put("/:householdId/decline-request", catchAsync(declineRequest))

router.post("/", catchAsync(createHousehold))

module.exports = router;