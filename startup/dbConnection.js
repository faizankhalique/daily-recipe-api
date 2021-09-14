const mongoose = require("mongoose");
const config = require("config");
module.exports = async function () {
  // mongoose.set("useFindAndModify", false);
  // mongoose.set("useCreateIndex", true);
  mongoose
    .connect(`mongodb://localhost:27017/${config.get("DataBase_Name")}`, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log(`DataBase Connection Successfully:`);
    })
    .catch((err) => {
      console.log(`DataBase Connection Error:`, err.message);
    });
};
