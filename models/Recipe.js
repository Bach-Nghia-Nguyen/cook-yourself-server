const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],

    dish_type: {
      type: String,
      required: false,
      enum: [
        "main dish",
        "side dish",
        "appetizer",
        "soup",
        "salad",
        "dessert",
        "drink",
        "vegan",
        "other",
      ],
    },

    preparation_time: {
      value: { type: Number, default: 0, min: [0, "Time can't be negative"] },
      unit: { type: String, enum: ["second", "minute", "hour"] },
    },
    cooking_time: {
      value: { type: Number, default: 0, min: [0, "Time can't be negative"] },
      unit: { type: String, enum: ["second", "minute", "hour"] },
    },
    portion: {
      type: Number,
      required: false,
      default: 1,
      min: [0, "Number of people can't be negative"],
    },
    ingredients: [
      {
        name: { type: String },
        amount: { type: String }, //{ type: Number, min: [0, "Amount can't be negative"] },
        unit: { type: String },
      },
    ],

    directions: [
      {
        step: { type: String },
      },
    ],

    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    reactions: { love: { type: Number, default: 0 } },
    commentCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

recipeSchema.plugin(require("./plugins/isDeletedFalse"));

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
