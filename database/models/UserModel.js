const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
  avatarURL: String,
  avatarPath: String,
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: String,
  verificationToken: String,
});

UserSchema.static('hashPasssword', (password) => {
  return bcrypt.hash(password, 4);
});

UserSchema.static('findByVerificationToken', async function (
  verificationToken,
) {
  return this.findOne({
    verificationToken,
  });
});

UserSchema.static('verifyUserEmail', async function (userId) {
  return this.findByIdAndUpdate(
    userId,
    { verificationToken: null },
    { strict: true },
  );
});

UserSchema.method('isPasswordValid', function (password) {
  return bcrypt.compare(password, this.password);
});

UserSchema.method('generateAndSaveToken', async function () {
  const newToken = jwt.sign({ id: this._id }, configEnv.jwtPrivateKey);

  await this.constructor.findByIdAndUpdate(
    this._id,
    { token: newToken },
    { strict: true },
  );
  return newToken;
});

UserSchema.method('deleteToken', async function () {
  await this.constructor.findByIdAndUpdate(
    this._id,
    { token: null },
    { strict: true },
  );
  return;
});

UserSchema.method('updateSub', async function (subscription) {
  await this.constructor.findByIdAndUpdate(
    this._id,
    { subscription },
    { strict: true },
  );
  return;
});

UserSchema.method('updateUser', async function (user) {
  const updated = await this.constructor.findByIdAndUpdate(
    this._id,
    { ...user },
    { strict: true },
  );
  return updated;
});

module.exports = mongoose.model('User', UserSchema);
