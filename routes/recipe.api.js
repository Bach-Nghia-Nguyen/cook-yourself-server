const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const recipeController = require("../controllers/recipe.controller");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
//const fileUpload = require("../helpers/upload.helper")("public/images");
//const uploader = fileUpload.uploader;
//const photoHelper = require("../helpers/photo.helper");

/**
 * @route GET api/recipes?page=1&limit=10
 * @description Get recipes with pagination
 * @access Public
 */
router.get("/", recipeController.getRecipes);

/**
 * @route GET api/recipes/:id
 * @description Get a single recipe
 * @access Public
 */
router.get(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  recipeController.getSingleRecipe
);

/**
 * @route POST api/recipes
 * @description Create a new recipe, with image uploader
 * @access Login required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  //uploader.array("images", 2),
  //photoHelper.resize,
  validators.validate([
    body("name", "Missing name").exists().notEmpty(),
    body("description", "Missing description").exists().notEmpty(),
  ]),
  recipeController.createNewRecipe
);

/**
 * @route PUT api/recipes/:id
 * @description Update a recipe
 * @access Login required
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("name", "Missing name").exists().notEmpty(),
    body("description", "Missing description").exists().notEmpty(),
  ]),
  recipeController.updateSingleRecipe
);

/**
 * @route DELETE api/recipes/:id
 * @description Delete a recipe
 * @access Login required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  recipeController.deleteSingleRecipe
);

module.exports = router;
