const express = require("express");
const multer = require("multer");
const fs = require("fs");

const auth = require("../middleware/auth");
const { recipeController } = require("../controllers");
const { isImage } = require("../helpers/utils");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let path = "./public/uploads/" + req.user._id;
    if (file.fieldname === "imageFile") {
      path = path + "/recipe/";
    }
    if (file.fieldname === "ingredients") {
      path = path + "/ingredients/";
    }
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    callback(null, path);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, " ") + "-" + file.originalname
    );
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 25 * 1024 * 1024, // 25MB
    fileSize: 25 * 1024 * 1024, // 25MB
  },
  fileFilter(req, file, cb) {
    if (!isImage(file.mimetype)) {
      cb(new Error("only upload files with jpg or jpeg format."));
    }
    cb(undefined, true);
  },
});

const router = express.Router();

router
  .route("/recipe")
  .get(auth, recipeController.getRecipes)
  .post(
    auth,
    upload.fields([
      {
        name: "imageFile",
        maxCount: 1,
      },
      {
        name: "ingredients",
      },
    ]),
    recipeController.createRecipe
  )
  .delete(auth, recipeController.deleteRecipe);
router.get("/home_recipes", auth, recipeController.getHomeRecipes);
router.get("/fresh_recipes", auth, recipeController.getFreshRecipes);
router.get(
  "/recommended_recipes",
  auth,
  recipeController.getRecommendedRecipes
);
router.get("/favorites_recipes", auth, recipeController.getFavoritesRecipes);
router.get(
  "/recently_viewed_recipes",
  auth,
  recipeController.getRecentlyViewedRecipes
);
router.get("/recipe/:id", auth, recipeController.getRecipeDetails);
router.put("/like_recipe", auth, recipeController.likeRecipe);
router.put(
  "/add_recently_viewed_recipe",
  auth,
  recipeController.addRecentlyViewedRecipe
);
router.delete(
  "/remove_recently_viewed_recipe",
  auth,
  recipeController.removeRecentlyViewedRecipe
);

module.exports = router;
