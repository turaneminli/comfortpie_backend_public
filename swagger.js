// swagger config

const swaggerAutogen = require("swagger-autogen")();
const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routers/mainRouter.js"];
swaggerAutogen(outputFile, endpointsFiles);
