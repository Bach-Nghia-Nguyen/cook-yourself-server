const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    reactions: { like: { type: Number, default: 0 } },
    commentCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

recipeSchema.plugin(require("./plugins/isDeletedFalse"));

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
