const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
module.exports = function (app) {
  app.use(cors({ origin: true, credentials: true }));
  app.use(helmet());
  app.use(compression());
};
