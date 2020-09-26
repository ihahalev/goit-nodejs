const Joi = require('joi');
// const bcrypt = require('bcryptjs');
const passHash = require('password-hash');
const { validate, ApiError } = require('../helpers');
const responseNormalizer = require('../normalizers/response-normalizer');
const UserModel = require('../database/models/UserModel');

class UserController {
  constructor() {
    // this._saltRounds = 4;
    this.validUserObject = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(3).required(),
    });
  }
  get createUser() {
    return this._createUser.bind(this);
  }
  get loginUser() {
    return this._loginUser.bind(this);
  }

  async _createUser(req, res) {
    validate(this.validUserObject, req.body);
    const { email, password } = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      throw new ApiError(409, 'Conflict', {
        message: 'Email in use',
      });
    }
    const passwordHash = await UserModel.hashPasssword(password);
    const userAdded = await UserModel.create({
      email,
      password: passwordHash,
    });
    const userRes = {
      email: userAdded.email,
      subscription: userAdded.subscription,
    };
    return res.status(201).send(responseNormalizer(userRes));
  }

  async _loginUser(req, res) {
    validate(this.validUserObject, req.body);
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log('email');
      throw new ApiError(401, 'Unauthorized', {
        message: 'Email or password is wrong',
      });
    }
    console.log(UserModel.hashPasssword(password));
    const isValid = user.isPasswordValid(password);
    if (!isValid) {
      console.log('pass');
      throw new ApiError(401, 'Unauthorized', {
        message: 'Email or password is wrong',
      });
    }
    const token = await user.generateAndSaveToken();
    res.status(200).send({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  }
}

module.exports = new UserController();
