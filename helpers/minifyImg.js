const path = require('path');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const fileMove = require('./file-move');
const configEnv = require('../config.env');

module.exports = async function (draftPath) {
  // try {
  const MINIFIED_DIR = configEnv.paths.avatars;

  // const { filename, path: draftPath } = req.file;
  console.log(draftPath);
  console.log(MINIFIED_DIR);
  const ava = await imagemin([`../tmp/*.{jpg,png}`], {
    destination: '../public/images',
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });
  // await fileMove(draftPath, MINIFIED_DIR);

  // await fsPromises.unlink(draftPath);
  console.log(ava);
  // req.file = {
  //   ...req.file,
  //   path: path.join(MINIFIED_DIR, filename),
  //   destination: MINIFIED_DIR,
  // };
  return ava;
  // next();
  // } catch (err) {
  //   next(err);
  // }
};
