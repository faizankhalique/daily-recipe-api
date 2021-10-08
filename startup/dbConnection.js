const mongoose = require("mongoose");
const config = require("config");
module.exports = async function () {
  mongoose
    .connect(config.get("DB_URI"), {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log(`DataBase Connection Successfully:`);
    })
    .catch((err) => {
      console.log(`DataBase Connection Error:`, err.message);
    });
};
