const express = require("express");
const authMiddleware = require("../middlewares/authentication");
const router = express.Router();
// const { body, param } = require("express-validator");

/**
 * @route POST api/products
 * @description Create new product
 * @access Admin, moderator only
 */
// router.post();

/**
 * @route GET api/products?page=1&limit=10
 * @description Get products with pagination
 * @access Public
 */
// router.get();

/**
 * @route GET api/products/:id
 * @description Get a single product
 * @access Public
 */
// router.get();

/**
 * @route PUT api/products/:id
 * @description Update a product
 * @access Admin, moderator only
 */
// router.put("/", authMiddleware.loginRequired, authMiddleware.adminRequired, );

/**
 * @route DELETE api/products/:id
 * @description Delelte a product
 * @access Admin, moderator only
 */
// router.delete();

module.exports = router;
