const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");

const authMiddleware = require("../middlewares/authentication");
const validators = require("../middlewares/validators");

const commentController = require("../controllers/comment.controller");

/**
 * @route GET api/comments/recipes/:id?page=1&limit=10
 * @description Get comments of a recipe with pagination
 * @access Public
 */
router.get(
  "/recipes/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.getCommentsOfRecipe
);

/**
 * @route POST api/comments/recipes/:id
 * @description Create a new comment for a recipe
 * @access Login required
 */
router.post(
  "/recipes/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
  ]),
  commentController.createNewComment
);

/**
 * @route PUT api/comments/:id
 * @description Update a comment
 * @access Login required
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
  ]),
  commentController.updateSingleComment
);

/**
 * @route DELETE api/comments/:id
 * @description Delete a comment
 * @access Login required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.deleteSingleComment
);

module.exports = router;
