import * as path from 'path';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'scope-auth',
    version: "1.0.0",
    description: 'API documentation for scope-auth',
  }
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, './controller/*.ts')],
};

export default options;
