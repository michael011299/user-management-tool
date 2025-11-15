const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GTM/GA User Management API",
      version: "1.0.0",
      description:
        "API for managing Google Tag Manager and Google Analytics user access across multiple agency accounts",
      contact: {
        name: "API Support",
        email: "support@agency.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Migrations",
        description: "User migration and offboarding operations",
      },
      {
        name: "Discovery",
        description: "Account discovery operations",
      },
      {
        name: "History",
        description: "Migration history and tracking",
      },
      {
        name: "Webhooks",
        description: "Monday.com webhook integration",
      },
      {
        name: "Monitoring",
        description: "Account capacity and monitoring",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
