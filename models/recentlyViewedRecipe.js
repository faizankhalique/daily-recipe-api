const mongoose = require("mongoose");

const recentlyViewedSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isViewed: {
      default: false,
      type: Boolean,
    },
  },
  {
    collection: "RecentlyViewedRecipe",
    timestamps: true, // inserts createdAt and updatedAt
  }
);

const RecentlyViewedRecipe = mongoose.model(
  "RecentlyViewedRecipes",
  recentlyViewedSchema
);

module.exports = RecentlyViewedRecipe;
