const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: { title: 'My Express Router API', 
    description: 'API Docs' 
  },
  servers: [
    {
      url: 'localhost:8080',
      description: 'Local Development Server'
    },
    {
      url: 'web-services-ok3j.onrender.com',
      description: 'Production Server'
    },
    {
      url: 'invidividual-project.onrender.com',
      description: 'individual Server'
    }
  ], 
  // swagger-autogen prefers host and schemes over servers in some versions
  schemes: ['http', 'https']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js']; // Point to your main router file

swaggerAutogen(outputFile, endpointsFiles, doc);

