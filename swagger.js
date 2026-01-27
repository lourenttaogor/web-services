const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: { title: 'My Express Router API', 
    description: 'API Docs' 
  },
  host: 'https://web-services-ok3j.onrender.com',
  // swagger-autogen prefers host and schemes over servers in some versions
  schemes: ['https']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js']; // Point to your main router file

swaggerAutogen(outputFile, endpointsFiles, doc);

