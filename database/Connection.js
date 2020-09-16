const mongodb = require('mongodb');

const configEnv = require('../config.env');

class Connection {
  constructor() {
    this.connection = null;
    this.database = null;
  }
  getCollection() {
    return this.database.collection(configEnv.dbCollection);
  }
  async connect() {
    const { MongoClient } = mongodb;
    this.connection = await MongoClient.connect(configEnv.dbConnectionUrl, {
      useUnifiedTopology: true,
    });
    this.database = this.connection.db(configEnv.dbName);
    console.log('Database connection successful');
  }

  async close() {
    this.connection.close();
  }
}

module.exports = new Connection();
