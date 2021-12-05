const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { displaySearchResults, showHousehold, sendRequest, acceptRequest, declineRequest, acceptDeclined, createHousehold } = require("../controllers/households")
const { isLoggedIn, householdExists, isHouseholdMember, isEligibleToJoin } = require("../middleware")

router.get("/find-or-create", isLoggedIn, catchAsync(householdExists), catchAsync(displaySearchResults))

router.get("/:householdId", isLoggedIn, catchAsync(householdExists), catchAsync(isHouseholdMember), catchAsync(showHousehold))

router.put("/:householdId/send-request", catchAsync(isEligibleToJoin), catchAsync(sendRequest))

router.put("/:householdId/accept-request", catchAsync(isHouseholdMember), catchAsync(acceptRequest))

router.put("/:householdId/accept-declined", catchAsync(isHouseholdMember), catchAsync(acceptDeclined))

router.put("/:householdId/decline-request", catchAsync(isHouseholdMember), catchAsync(declineRequest))

router.post("/", catchAsync(createHousehold))

module.exports = router;