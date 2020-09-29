require('dotenv').config();
const path = require('path');

module.exports = {
  port: process.env.PORT,
  dbConnectionUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  dbCollection: process.env.DB_COLLECTION,
  jwtPrivateKey: process.env.TOKEN_PRIVATE_KEY,
  srvUrl: process.env.SRV_URL,

  paths: {
    tmp: path.join(process.cwd(), 'tmp'),
    avatars: path.join(process.cwd(), 'public', 'images'),
  },
};
