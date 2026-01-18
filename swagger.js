const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'A simple Express API for managing contacts',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://web-services-ok3j.onrender.com'
          : 'http://localhost:8080',
        description: process.env.NODE_ENV === 'production'
          ? 'Production server'
          : 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
