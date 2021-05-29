const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Comment = require("../models/Comment");
const Recipe = require("../models/Recipe");
// const User = require("../models/User");

const recipeController = {};

recipeController.createNewRecipe = catchAsync(async (req, res, next) => {
  const author = req.userId;
  const {
    name,
    description,
    dish_type,
    preparation_time,
    cooking_time,
    portion,
    //ingredients,
    //directions,
  } = req.body;
  let { images } = req.body;

  // const preparation_time = {
  //   value: "",
  //   unit: "",
  // };
  // preparation_time.value = preparation_time_value;
  // preparation_time.unit = preparation_time_unit;

  const recipe = await Recipe.create({
    name,
    description,
    author,
    dish_type,
    preparation_time,
    cooking_time,
    portion,
    //ingredients,
    //directions,
    images,
  });

  return sendResponse(
    res,
    200,
    true,
    recipe,
    null,
    "Create New Recipe successfully"
  );
});

recipeController.getRecipes = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalRecipes = await Recipe.countDocuments({
    ...filter,
    isDeleted: false,
  });

  const totalPages = Math.ceil(totalRecipes / limit);
  const offset = limit * (page - 1);

  const recipes = await Recipe.find(filter)
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  return sendResponse(
    res,
    200,
    true,
    { recipes, totalPages },
    null,
    "Get Recipes success"
  );
});

recipeController.getSingleRecipe = catchAsync(async (req, res, next) => {
  let recipe = await Recipe.findById(req.params.id).populate("author");
  if (!recipe)
    return next(
      new AppError(404, "Recipe not found", "Get Single Recipe error")
    );
  recipe = recipe.toJSON();
  recipe.comments = await Comment.find({ recipe: recipe._id }).populate("user");

  return sendResponse(res, 200, true, recipe, null, null);
});

recipeController.updateSingleRecipe = catchAsync(async (req, res, next) => {
  const author = req.userId;
  const recipeId = req.params.id;
  const {
    name,
    description,
    images,
    dish_type,
    preparation_time,
    cooking_time,
    portion,
    ingredients,
    directions,
  } = req.body;

  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipeId, author: author },
    {
      name,
      description,
      images,
      time,
      dish_type,
      preparation_time,
      cooking_time,
      portion,
      ingredients,
      directions,
    },
    { new: true }
  );

  if (!recipe)
    return next(
      new AppError(
        400,
        "Recipe not found or User not authorized",
        "Update Recipe Error"
      )
    );

  return sendResponse(
    res,
    200,
    true,
    recipe,
    null,
    "Update Recipe successfully"
  );
});

recipeController.deleteSingleRecipe = catchAsync(async (req, res, next) => {
  const author = req.userId;
  const recipeId = req.params.id;

  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipeId, author: author },
    { isDeleted: true },
    { new: true }
  );

  if (!recipe)
    return next(
      new AppError(
        400,
        "Recipe not found or User not authorized",
        "Delete Recipe Error"
      )
    );

  return sendResponse(
    res,
    200,
    true,
    recipe,
    null,
    "Delete Recipe successfully"
  );
});

module.exports = recipeController;
