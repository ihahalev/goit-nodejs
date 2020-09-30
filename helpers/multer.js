const multer = require('multer');
const path = require('path');
const uuid = require('uuid').v4;
const configEnv = require('../config.env');

const storage = multer.diskStorage({
  destination: configEnv.paths.tmp,
  filename: function (req, file, cb) {
    console.log('file', file);
    const ext = path.parse(file.originalname).ext;
    cb(null, uuid() + ext);
  },
});

module.exports = multer({ storage });
