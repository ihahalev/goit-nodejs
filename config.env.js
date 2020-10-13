require('dotenv').config();
const path = require('path');

module.exports = {
  port: process.env.PORT,
  dbConnectionUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  dbCollection: process.env.DB_COLLECTION,
  jwtPrivateKey: process.env.TOKEN_PRIVATE_KEY,
  srvUrl: `${process.env.SRV_URL}:${process.env.PORT}`,
  imgUrl: `${process.env.SRV_URL}:${process.env.PORT}/images/`,

  paths: {
    tmp: path.join(process.cwd(), 'tmp'),
    avatars: path.join(process.cwd(), 'public', 'images'),
  },

  logLevel: process.env.LOG_LEVEL,

  mail: {
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
};
