const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync")
const { findHousehold, showHousehold, updateHousehold, createHousehold } = require("../controllers/households")

router.get("/choose", (req, res) => {
    res.render("households/choose", { household: null })
})

router.get("/search", catchAsync(findHousehold))

router.route("/:householdId")
    .get(catchAsync(showHousehold))
    .put(catchAsync(updateHousehold))

router.post("/", catchAsync(createHousehold))

module.exports = router;