const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const joi = require('joi');
const jwt = require('jsonwebtoken');

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

UserSchema.static('hashPasssword', (password) => {
  return bcrypt.hash(password);
});

UserSchema.method('isPasswordValid', function (password) {
  return bcrypt.compare(password, this.password);
});

UserSchema.pre('save', function () {
  if (this.isNew) {
    this.password = this.constructor.hashPasssword(this.password);
  }
});

module.exports = mongoose.model('User', UserSchema);
