const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API documentation for User management',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/routes.js'], // ให้ระบุไฟล์ที่มี route definitions ของคุณที่นี่
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
