const express = require("express");
const { createComment, deleteComment } = require("../controllers/comments");

const router = express.Router({ mergeParams: true });

router.post("/", createComment)
router.delete("/:commentId", deleteComment)
module.exports = router;