const express = require("express");
const { addActivityType, updateActivityType, deleteActivityType } = require("../controllers/activity-types");

const router = express.Router();

router.post("/", addActivityType)

router.route("/:typeId")
    .put(updateActivityType)
    .delete(deleteActivityType)

module.exports = router;