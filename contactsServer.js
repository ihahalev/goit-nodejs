const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const configEnv = require('./config.env');
const contactsRouter = require('./routers/contactsRouter');

const connection = require('./database/Connection');

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    await connection.connect();
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
    process.on('SIGILL', () => {
      connection.close();
    });
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
