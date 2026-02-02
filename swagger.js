const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Web Services API',
    description: 'API with authentication (OAuth2 GitHub and Local Login/Signup)',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Local Development Server'
    },
    {
      url: 'https://invidividual-project.onrender.com',
      description: 'Production Server'
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Session-based authentication'
    },
    sessionAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
      description: 'Express session cookie'
    }
  },
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

