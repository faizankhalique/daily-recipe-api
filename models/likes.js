const mongoose = require("mongoose");

const recipeLikeSchema = new mongoose.Schema(
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
    isLiked: {
      default: false,
      type: Boolean,
    },
  },
  {
    collection: "Likes",
    timestamps: true, // inserts createdAt and updatedAt
  }
);

const Like = mongoose.model("Likes", recipeLikeSchema);

module.exports = Like;
