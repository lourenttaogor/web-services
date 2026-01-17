const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'A simple Express API for managing contacts',
  },
  host: 'localhost:8080',
  schemes: ['http', 'https'],
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Development server',
    },
    {
      url: 'https://web-services-ok3j.onrender.com',
      description: 'Production server',
    },
  ],
};

const outputFile = './swagger-output.json';
// Point to the main server file that imports the routes
const endpointsFiles = ['./server.js'];

console.log('Starting swagger generation...');
console.log('Output file:', outputFile);
console.log('Endpoints files:', endpointsFiles);

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully!');
    console.log('Output file:', outputFile);
}).catch((error) => {
    console.error('Error generating swagger documentation:', error);
});
