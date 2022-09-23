const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for JSONPlaceholder',
        version: '1.0.0',
        description:
            'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
            name: 'JSONPlaceholder',
            url: 'https://jsonplaceholder.typicode.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000/api',
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// swagger route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

module.exports = app;