require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

require('./database'); // Importante para inicializar a conexão

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  // Novo método para registrar o middleware de erro
  exceptionHandler() {
    this.server.use(errorHandler);
  }
}

module.exports = new App().server;