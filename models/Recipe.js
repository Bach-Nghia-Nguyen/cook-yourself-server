const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],

    time: { type: Number, required: false },
    portion: { type: Number, required: false, default: 1 },
    ingredients: [
      {
        name: { type: String },
        amount: { type: Number },
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
