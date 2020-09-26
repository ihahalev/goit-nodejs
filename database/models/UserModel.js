const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passHash = require('password-hash');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const configEnv = require('../../config.env');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator(email) {
        const { error } = joi.string().email().validate(email);

        if (error) throw new Error('Email not valid');
      },
    },
  },
  password: String,
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: String,
});

UserSchema.static.saltRounds = 4;

UserSchema.static('hashPasssword', (password) => {
  return bcrypt.hash(password, 4); //, this.constructor.saltRounds);
  // return passHash.generate(password);
});

UserSchema.method('isPasswordValid', function (password) {
  return bcrypt.compare(password, this.password);
  // return passHash.verify(password, this.password);
});

UserSchema.method('generateAndSaveToken', async function () {
  const token = jwt.sign({ id: this._id }, configEnv.jwtPrivateKey);

  this.constructor.findByIdAndUpdate(this._id, { token }, { strict: true });

  return token;
});

UserSchema.pre('save', function () {
  if (this.isNew) {
    this.password = this.constructor.hashPasssword(this.password);
  }
});

module.exports = mongoose.model('User', UserSchema);
