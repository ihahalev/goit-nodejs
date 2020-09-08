const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const configEnv = require('./config.env');
const contactsRouter = require('./routers/contactsRouter');

module.exports = class UsersServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(morgan('tiny'));
    this.server.use(express.json());
    this.server.use(cors());
  }

  initRoutes() {
    this.server.use('/api/contacts', contactsRouter);
  }

  startListening() {
    this.server.listen(configEnv.port, (err) => {
      if (err) {
        return console.error(err);
      }

      console.info('server started at port', configEnv.port);
    });
  }
};
