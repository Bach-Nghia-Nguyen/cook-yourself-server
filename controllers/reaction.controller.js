const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const mongoose = require("mongoose");
const Reaction = require("../models/Reaction");

const reactionController = {};

reactionController.saveReaction = catchAsync(async (req, res, next) => {
  const { targetType, targetId, emoji } = req.body;

  const targetObj = await mongoose.model(targetType).findById(targetId);
  console.log("targetObj?", targetObj);

  if (!targetObj)
    return next(
      new AppError(404, `${targetType} not found`, "Create Reaction Error")
    );

  // Find the reaction of the current user
  let reaction = await Reaction.findOne({
    targetType,
    targetId,
    user: req.userId,
  });
  console.log("reactionOfCurrentUser?", reaction);
  let message = "";
  if (!reaction) {
    await Reaction.create({ targetType, targetId, user: req.userId, emoji });
    message = "Added reaction";
  } else {
    if (reaction.emoji !== emoji) {
      await Reaction.findOneAndUpdate({ _id: reaction._id }, { emoji });
      message = "Updated reaction";
    } else {
      await Reaction.findOneAndDelete({ _id: reaction._id });
      message = "Removed reaction";
    }
  }
  console.log("updateReaction?", reaction);
  // Get the updated number of reactions in the targetType
  const reactionState = await mongoose
    .model(targetType)
    .findById(targetId, "reactions");
  //.findById(targetType)
  console.log("reactionState?", reactionState);

  return sendResponse(res, 200, true, reactionState.reactions, null, message);
});

module.exports = reactionController;
