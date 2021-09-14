require("express-async-errors");
const express = require("express");
const config = require("config");
const path = require("path");

const routes = require("./routes");
const DBConnection = require("./startup/dbConnection");
const prod = require("./startup/prod");
const errors = require("./middleware/errors");
const errorController = require("./controllers/error");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR : jwtPrivateKey not define");
  process.exit(1);
}

const app = express();
prod(app); //allows cross origin
DBConnection(); //db connection.

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/uploads")));
app.use("/api/v1", routes);
app.use(errors);
app.use(errorController.get404);

const port = process.env.PORT || config.get("port");

app.listen(port, "0.0.0.0", "localhost", () => {
  console.log(`Server Listen at:${port}`);
});
