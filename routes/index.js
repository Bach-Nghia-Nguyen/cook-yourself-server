const express = require("express");
const router = express.Router();

// userAPI
const userApi = require("./user.api");
router.use("/users", userApi);

// authAPI
const authApi = require("./auth.api");
router.use("/auth", authApi);

// recipeAPI
const recipeApi = require("./recipe.api");
router.use("/recipes", recipeApi);

// commentAPI
const commentApi = require("./comment.api");
router.use("/comments", commentApi);

// reactionAPI
const reactionApi = require("./reaction.api");
router.use("/reactions", reactionApi);

// productAPI
// const productApi = require("./product.api");

// router.use("/products", productAPI);

// basketAPI
// const basketApi = require("./basket.api");
// router.use("/basket", basketApi);

module.exports = router;
