const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");

const commentController = {};

commentController.createNewComment = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const recipeId = req.params.id;
  const { content } = req.body;

  const recipe = Recipe.findById(recipeId);
  if (!recipe)
    return next(
      new AppError(404, "Recipe not found", "Create New Comment Error")
    );

  let comment = await Comment.create({
    user: userId,
    recipe: recipeId,
    content,
  });

  comment = await comment.populate("user").execPopulate();

  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Create new comment successfully"
  );
});

commentController.getCommentsOfRecipe = catchAsync(async (req, res, next) => {
  const recipeId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const recipe = Recipe.findById(recipeId);
  if (!recipe)
    return next(
      new AppError(404, "Recipe not found", "Create New Comment Error")
    );

  const totalComments = await Comment.countDocuments({ recipe: recipeId });
  const totalPages = Math.ceil(totalComments / limit);
  const offset = limit * (page - 1);

  const comments = await Comment.find({ recipe: recipeId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(res, 200, true, { comments, totalPages }, null, "");
});

commentController.updateSingleComment = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const commentId = req.params.id;
  const { content } = req.body;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, user: userId },
    { content },
    { new: true }
  );

  if (!comment)
    return next(
      new AppError(
        400,
        "Comment not found or User not authorized",
        "Update Comment Error"
      )
    );

  return sendResponse(res, 200, true, comment, null, "Update successfully");
});

commentController.deleteSingleComment = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const commentId = req.params.id;

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    user: userId,
  });

  if (!comment)
    return next(
      new AppError(
        400,
        "Comment not found or User not authorized",
        "Delete Comment Error"
      )
    );

  return sendResponse(res, 200, true, null, null, "Delete successfully");
});

module.exports = commentController;
