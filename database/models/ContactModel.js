const mongoose = require('mongoose');
const joi = require('joi');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    validate: {
      validator(email) {
        const { error } = joi.string().email().validate(email);

        if (error) throw new Error('Email not valid');
      },
    },
  },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  subscription: { type: String },
  token: { type: String },
});

module.exports = mongoose.model('Contact', ContactSchema);
