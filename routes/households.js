const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { displaySearchResults, showHousehold, sendRequest, acceptRequest, declineRequest, createHousehold } = require("../controllers/households")
const { isHouseholdMember } = require("../middleware")

router.get("/find-or-create", catchAsync(displaySearchResults))

router.get("/:householdId", isHouseholdMember, catchAsync(showHousehold))

router.put("/:householdId/send-request", catchAsync(sendRequest))

router.put("/:householdId/accept-request", isHouseholdMember, catchAsync(acceptRequest))

router.put("/:householdId/decline-request", isHouseholdMember, catchAsync(declineRequest))

router.post("/", catchAsync(createHousehold))

module.exports = router;