const mongoose = require("mongoose");
const Recipe = require("../models/recipe");
const Like = require("../models/likes");
const RecentlyViewedRecipe = require("../models/recentlyViewedRecipe");
const utils = require("../helpers/utils");
const sendPushNotification = require("../helpers/pushNotifications");
const { User } = require("../models/user");

exports.createRecipe = async (req, res, next) => {
  const { name, category, calories, time, serve, description } = req.body;
  const recipe = new Recipe({
    name,
    category,
    calories,
    time,
    serve,
    description,
  });
  if (req.files) {
    const recipeFile = req.files.imageFile;
    const ingredientsFiles = req.files.ingredients;
    if (recipeFile) {
      recipeFile.map((file) => {
        const { destination, filename } = file;
        recipe.image = utils.createImageUrl(destination, filename);
      });
      if (ingredientsFiles) {
        const ingredients = [];
        ingredientsFiles.map((file) => {
          const { destination, filename, originalname } = file;
          const name = originalname.split(".");
          ingredients.push({
            name: name[0],
            image: utils.createImageUrl(destination, filename),
          });
        });

        recipe.ingredients = ingredients;
      }
    }
    const result = await recipe.save();
    const users = await User.find().lean();
    for (const user of users) {
      if (user.expoPushToken)
        await sendPushNotification(user.expoPushToken, result.name, {
          id: result._id,
        });
    }
    res.status(200).send(result);
  }
};

exports.getRecipes = async (req, res, next) => {
  const recipes = await Recipe.aggregate([
    {
      $lookup: {
        from: "Likes",
        localField: "_id",
        foreignField: "recipe",
        as: "isLiked",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  const filterRecipes = [];
  recipes.forEach((recipe) => {
    let isLikedRecipe = recipe.isLiked.find(
      (item) => item.user == req.user._id
    );
    filterRecipes.push({
      ...recipe,
      isLiked: isLikedRecipe ? isLikedRecipe.isLiked : false,
    });
  });
  res.status(200).send(filterRecipes);
};
exports.getFavoritesRecipes = async (req, res, next) => {
  const recipes = await Recipe.aggregate([
    {
      $lookup: {
        from: "Likes",
        localField: "_id",
        foreignField: "recipe",
        as: "isLiked",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  const filterRecipes = [];
  recipes.forEach((recipe) => {
    let isLikedRecipe = recipe.isLiked.find(
      (item) => item.user == req.user._id && item.isLiked == true
    );
    if (isLikedRecipe) {
      filterRecipes.push({
        ...recipe,
        isLiked: isLikedRecipe ? isLikedRecipe.isLiked : false,
      });
    }
  });
  res.status(200).send(filterRecipes);
};
exports.getRecipeDetails = async (req, res, next) => {
  const id = req.params.id;
  const recipes = await Recipe.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "Likes",
        localField: "_id",
        foreignField: "recipe",
        as: "isLiked",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  const recipe = recipes[0];
  if (!recipe) return res.status(404).send("Recipe not found!");
  let isLikedRecipe = recipe.isLiked.find((item) => item.user == req.user._id);
  const recipe_ = {
    ...recipe,
    isLiked: isLikedRecipe ? isLikedRecipe.isLiked : false,
  };
  res.status(200).send(recipe_);
};
exports.getHomeRecipes = async (req, res, next) => {
  const filter = utils.getLastTwoMonthRecipeFilter();
  const recipes = await Recipe.aggregate([
    filter,
    {
      $lookup: {
        from: "Likes",
        localField: "_id",
        foreignField: "recipe",
        as: "isLiked",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  const filterRecipes = [];
  recipes.forEach((recipe) => {
    let isLikedRecipe = recipe.isLiked.find(
      (item) => item.user == req.user._id
    );
    filterRecipes.push({
      ...recipe,
      isLiked: isLikedRecipe ? isLikedRecipe.isLiked : false,
      date: new Date(recipe.createdAt).toLocaleDateString(),
    });
  });
  let freshRecipes = [...filterRecipes].slice(0, 4);
  let recommendedRecipes = [...filterRecipes].reverse().slice(0, 5);
  res.status(200).send({ freshRecipes, recommendedRecipes });
};
exports.getFreshRecipes = async (req, res, next) => {
  const filter = utils.getLastTwoMonthRecipeFilter();
  const recipes = await Recipe.aggregate([
    filter,
    {
      $lookup: {
        from: "Likes",
        localField: "_id",
        foreignField: "recipe",
        as: "isLiked",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  const filterRecipes = [];
  recipes.forEach((recipe) => {
    let isLikedRecipe = recipe.isLiked.find(
      (item) => item.user == req.user._id
    );
    filterRecipes.push({
      ...recipe,
      isLiked: isLikedRecipe ? isLikedRecipe.isLiked : false,
    });
  });

  res.status(200).send(filterRecipes);
};
exports.getRecommendedRecipes = async (req, res, next) => {
  const filter = utils.getLastMonthRecipeFilter();
  const recipes = await Recipe.aggregate([
    filter,
    {
      $lookup: {
        from: "Likes",
        localField: "_id",
        foreignField: "recipe",
        as: "isLiked",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  const filterRecipes = [];
  recipes.forEach((recipe) => {
    let isLikedRecipe = recipe.isLiked.find(
      (item) => item.user == req.user._id
    );
    filterRecipes.push({
      ...recipe,
      isLiked: isLikedRecipe ? isLikedRecipe.isLiked : false,
    });
  });

  res.status(200).send(filterRecipes);
};
exports.likeRecipe = async (req, res, next) => {
  const { recipe, isLiked } = req.body;
  let like = await Like.findOne({ recipe, user: req.user._id });
  if (like) {
    like.isLiked = isLiked;
    await like.save();
  } else {
    like = new Like({
      recipe,
      user: req.user._id,
      isLiked,
    });
    await like.save();
  }
  res.status(200).send({});
};

exports.addRecentlyViewedRecipe = async (req, res, next) => {
  const { recipe } = req.body;
  let recentlyViewedRecipe = await RecentlyViewedRecipe.findOne({
    recipe,
    user: req.user._id,
  });
  if (!recentlyViewedRecipe) {
    recentlyViewedRecipe = new RecentlyViewedRecipe({
      recipe,
      user: req.user._id,
      isViewed: true,
    });
    await recentlyViewedRecipe.save();
  }
  res.status(200).send(recentlyViewedRecipe);
};
exports.removeRecentlyViewedRecipe = async (req, res, next) => {
  const recentlyViewedRecipe = await RecentlyViewedRecipe.deleteMany({
    user: req.user._id,
  });
  res.status(200).send(recentlyViewedRecipe);
};
exports.getRecentlyViewedRecipes = async (req, res, next) => {
  const recipes = await RecentlyViewedRecipe.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "Recipe",
        localField: "recipe",
        foreignField: "_id",
        as: "recipes",
      },
    },
    { $unwind: "$recipes" },
    {
      $lookup: {
        from: "Likes",
        localField: "recipes._id",
        foreignField: "recipe",
        as: "isLiked",
      },
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        recipe: "$recipes",
        isLiked: "$isLiked",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  const filterRecipes = [];
  recipes.forEach((recipe) => {
    let isLikedRecipe = recipe.isLiked.find(
      (item) => item.user == req.user._id
    );
    filterRecipes.push({
      ...recipe.recipe,
      isLiked: isLikedRecipe ? isLikedRecipe.isLiked : false,
    });
  });
  res.status(200).send(filterRecipes);
};
exports.deleteRecipe = async (req, res, next) => {
  const { recipe: id } = req.body;
  let recipe = await Recipe.findById(id);
  if (!recipe) return res.status(404).send("Recipe not found");

  if (recipe.image) {
    const path = utils.getImagePath(recipe.image);
    utils.deleteImage(path);
  }
  if (recipe.ingredients.length > 0) {
    recipe.ingredients.map((ingredient) => {
      const path = utils.getImagePath(ingredient.image);
      utils.deleteImage(path);
    });
  }
  const recentlyViewedRecipe = await RecentlyViewedRecipe.deleteMany({
    recipe: id,
  });
  const likes = await Like.deleteMany({ recipe: id });
  let result = await Recipe.findByIdAndDelete(id);
  res.status(200).send(result);
};
