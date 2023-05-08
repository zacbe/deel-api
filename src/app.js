// system imports
const path = require("path");

// dependency imports
const express = require("express");
const pino = require("pino");
// eslint-disable-next-line node/no-unpublished-require
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");
const bodyParser = require("body-parser");
const dotenvPath =
  typeof process.env.DOTENV_CONFIG_PATH === "string"
    ? path.resolve(process.cwd(), process.env.DOTENV_CONFIG_PATH)
    : path.resolve(process.cwd(), ".env");

require("dotenv").config({ path: dotenvPath });

// create a Pino logger
const logger = pino({
  formatters: {
    level: (label) => {
      return {
        level: label,
      };
    },
  },
});

// local imports
const { sequelize } = require("./model");
const adminRouter = require("./routes/admin-routes");
const userRouter = require("./routes/user-routes");

const app = express();
app.use(bodyParser.json());

// log incoming requests
app.use((req, res, next) => {
  logger.info({ message: `Incoming request for ${req.url}` });
  next();
});
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
