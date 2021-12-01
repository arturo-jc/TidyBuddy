const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { displaySearchResults, showHousehold, sendRequest, acceptRequest, declineRequest, createHousehold } = require("../controllers/households")
const { isLoggedIn, isHouseholdMember, isEligibleToJoin } = require("../middleware")

router.get("/find-or-create", isLoggedIn, catchAsync(displaySearchResults))

router.get("/:householdId", isLoggedIn, isHouseholdMember, catchAsync(showHousehold))

router.put("/:householdId/send-request", isLoggedIn, isEligibleToJoin, catchAsync(sendRequest))

router.put("/:householdId/accept-request", isLoggedIn, isHouseholdMember, catchAsync(acceptRequest))

router.put("/:householdId/decline-request", isLoggedIn, isHouseholdMember, catchAsync(declineRequest))

router.post("/", catchAsync(createHousehold))

module.exports = router;