const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
    favorites: [
      {
        recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
      },
    ],
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
