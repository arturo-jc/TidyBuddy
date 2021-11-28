const express = require("express");
const catchAsync = require("../utilities/catchAsync")
const { createComment, deleteComment } = require("../controllers/comments");

const router = express.Router({ mergeParams: true });

router.post("/", catchAsync(createComment))
router.delete("/:commentId", catchAsync(deleteComment))
module.exports = router;