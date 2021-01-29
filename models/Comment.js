const mongoose = require("mongoose");
const Recipe = require("./Recipe");

const Schema = mongoose.Schema;

const commentSchema = Schema(
  {
    content: { tyep: String, required: true },
    user: { type: Schema.ObjectId, required: true, ref: "User" },
    recipe: { type: Schema.ObjectId, required: true, ref: "Recipe" },
    reactions: { like: { type: Number, default: 0 } },
  },
  { timestamps: true }
);

// how many comments are there in a recipe
commentSchema.statics.calculateComments = async function (recipeId) {
  const commentCount = await this.find({ recipe: recipeId }).countDocuments();
  await Recipe.findByIdAndUpdate(recipeId, { commentCount: commentCount });
};

commentSchema.post("save", async function () {
  await this.constructor.calculateComments(this.recipe);
});

// Neither findByIdAndUpdate nor findByIdAndUpdate have access to document middleware.
// They only get access to query middleware
// Inside this hook, this will point to the current query, not the current comment.
// Therefore, to access the review, we'll need to execute the query.

commentSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});

commentSchema.post(/^/, async function (next) {
  await this.doc.constructor.calculateComments(this.doc.recipe);
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
