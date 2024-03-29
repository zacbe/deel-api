/* eslint-disable node/no-unpublished-require */
const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  autoHeaders: true,
});

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:3001",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/app.js"];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
