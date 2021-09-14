const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    category: String,
    calories: Number,
    rating: Number,
    time: String,
    serve: Number,
    image: String,
    description: String,
    ingredients: [
      {
        name: { type: String, require: true },
        image: { type: String, require: true },
      },
    ],
  },
  {
    collection: "Recipe",
    timestamps: true, // inserts createdAt and updatedAt
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
