const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const recipeRoute = require("./recipeRoute");

module.exports = [].concat(authRoute, userRoute, recipeRoute);
