const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authMiddleware = require("../middlewares/authentication");
const validators = require("../middlewares/validators");

const reactionController = require("../controllers/reaction.controller");

/**
 * @route POST api/reactions
 * @description Save a reaction to recipe or comment
 * @access Login required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  validators.validate([
    body("targetType", "Invalid targetType")
      .exists()
      .isIn(["Recipe", "Comment"]),
    body("targetId", "Invalid targetId")
      .exists()
      .custom(validators.checkObjectId),
    body("emoji", "Invalid emoji").exists().isIn(["love"]),
  ]),
  reactionController.saveReaction
);

module.exports = router;
