const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Itens por RM (genérica)",
      version: "1.0.0",
      description:
        "API exemplo que armazena itens genéricos identificados por rm.",
    },
    servers: [{ url: "https://items-api-3d8ec14523c8.herokuapp.com/" }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
