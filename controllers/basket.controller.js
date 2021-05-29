const {
  catchAsync,
  AppError,
  sendResponse,
} = require("../helpers/utils.helper");
const Basket = require("../models/Basket");

const basketController = {};

basketController.getBasket = catchAsync(async (req, res, next) => {
  return sendResponse();
});

basketController.createBasket = catchAsync(async (req, res, next) => {
  const produce = await Basket.findByById(productId).populate("productId");
  return sendResponse();
});

basketController.updateBasket = catchAsync(async (req, res, next) => {
  return sendResponse();
});

basketController.deleteBasket = catchAsync(async (req, res, next) => {
  return sendResponse();
});

module.exports = basketController;
