const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');


function setSwagger(app) {
    const options = {
        swaggerDefinition: {
            openapi: '3.0.1', // YOU NEED THIS
            info: {
              title: 'Your API title',
              version: '1.0.0',
              description: 'Your API description'
            },
            basePath: '/',
            components: {
              securitySchemes: {
                bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                }
              }
            }
            //security: [{
            //  bearerAuth: []
            //}]
          },
          apis: ['./*.js'],
    };
    const swaggerSpec = swaggerJSDoc(options);

    app.get('/swagger.json', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setSwagger;