const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Only "Like" emoji
const reactionSchema = Schema(
  {
    user: { type: Schema.ObjectId, required: true, ref: "User" },
    targetType: { type: String, required: true, enum: ["Recipe", "Comment"] },
    targetId: { type: Schema.ObjectId, required: true, refPath: "targetType" },
    emoji: { type: String, required: true, enum: ["like"] },
  },
  { timestamps: true }
);

reactionSchema.statics.calculateReaction = async function (
  targetId,
  targetType
) {
  const stats = await this.aggregate([
    { $match: { targetId } },
    {
      $group: {
        _id: "$targetId",
        like: { $sum: { $cond: [{ $eq: ["$emoji", "like"] }, 1, 0] } },
      },
    },
  ]);

  await mongoose.model(targetType).findByIdAndDelete(targetId, {
    reactions: { like: (stats[0] && stats[0].like) || 0 },
  });
};

reactionSchema.post("save", async function () {
  // this point to current comment
  await this.constructor.calculateReaction(this.targetId, this.targetType);
});

reactionSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});

reactionSchema.post(/^findOneAnd/, async function (next) {
  await this.doc.constructor.calculateReaction(
    this.doc.targetId,
    this.doc.targetType
  );
});

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;
