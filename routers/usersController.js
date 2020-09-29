const Joi = require('joi');

const {
  validate,
  ApiError,
  avaGenerate,
  minifyImg,
  fileMove,
} = require('../helpers');
const responseNormalizer = require('../normalizers/response-normalizer');
const UserModel = require('../database/models/UserModel');
const configEnv = require('../config.env');

class UserController {
  constructor() {
    this.validUserObject = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(3).required(),
    });
    this.validSubscription = Joi.object({
      subscription: Joi.string().valid('free', 'pro', 'premium'),
    });
    this.validUserUpdate = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().min(3),
      subscription: Joi.string().valid('free', 'pro', 'premium'),
    });
  }
  get createUser() {
    return this._createUser.bind(this);
  }
  get loginUser() {
    return this._loginUser.bind(this);
  }
  get updateSubscription() {
    return this._updateSubscription.bind(this);
  }
  // get updateUser() {
  //   return this._updateUser.bind(this);
  // }

  async _createUser(req, res) {
    validate(this.validUserObject, req.body);
    const { email, password } = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      throw new ApiError(409, 'Conflict', {
        message: 'Email in use',
      });
    }
    const { firstAva, avaDest } = await avaGenerate(email);
    const passwordHash = await UserModel.hashPasssword(password);
    const userAdded = await UserModel.create({
      email,
      password: passwordHash,
      avatarURL: `${configEnv.srvUrl}:${configEnv.port}/images/${firstAva}`,
      avatarPath: avaDest,
    });
    const userRes = {
      email: userAdded.email,
      subscription: userAdded.subscription,
      avatarURL: userAdded.avatarURL,
    };
    return res.status(201).send(responseNormalizer(userRes));
  }

  async _loginUser(req, res) {
    validate(this.validUserObject, req.body);
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Unauthorized', {
        message: 'Email or password is wrong',
      });
    }

    const isValid = user.isPasswordValid(password);
    if (!isValid) {
      throw new ApiError(401, 'Unauthorized', {
        message: 'Email or password is wrong',
      });
    }
    const token = await user.generateAndSaveToken();
    res.status(200).send(
      responseNormalizer({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      }),
    );
  }

  async logoutUser(req, res) {
    const { _id } = req.user;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new ApiError(401, 'Unauthorized', {
        message: 'Not authorized',
      });
    }
    await user.deleteToken(_id);
    return res.status(204).send();
  }

  async currentUser(req, res) {
    const { _id } = req.user;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new ApiError(401, 'Unauthorized', {
        message: 'Not authorized',
      });
    }

    const userRes = {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    };
    return res.status(200).send(responseNormalizer(userRes));
  }

  async _updateSubscription(req, res) {
    validate(this.validSubscription, req.body);
    const { subscription } = req.body;
    const { _id } = req.user;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new ApiError(401, 'Unauthorized', {
        message: 'Not authorized',
      });
    }
    await user.updateSub(subscription);
    res.status(205).send(
      responseNormalizer({
        email: user.email,
        subscription,
        avatarURL: user.avatarURL,
      }),
    );
  }

  async updateUser(req, res) {
    console.log('req.file', req.file);
    // console.log('req.body', req.body);
    await minifyImg(req.file.path);
    // await fileMove(req.file.path, configEnv.paths.avatars);
    // validate(this.validUserUpdate, req.body);
    const { subscription } = req.body;
    // const { _id } = req.user;
    // const user = await UserModel.findById(_id);
    // if (!user) {
    //   throw new ApiError(401, 'Unauthorized', {
    //     message: 'Not authorized',
    //   });
    // }
    // await user.updateSub(subscription);
    res.status(200).send(
      responseNormalizer({
        // avatarURL: user.avatarURL,
      }),
    );
  }
}

module.exports = new UserController();
