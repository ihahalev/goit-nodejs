const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { validate, ApiError } = require('../helpers');
const responseNormalizer = require('../normalizers/response-normalizer');
const UserModel = require('../database/models/UserModel');

class UserController {
  constructor() {
    this.saltRounds = 4;
    this.validUserObject = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(3).required(),
    });
  }
  get createUser() {
    return this._createUser.bind(this);
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
    const passwordHash = await bcrypt.hash(password, this.saltRounds);
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
}

module.exports = new UserController();
