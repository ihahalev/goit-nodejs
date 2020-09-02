const express = require('express');
const router = express.Router();
const Joi = require('joi');
const responseNormalizer = require('../normalizers/response-normalizer');
const errorWrapper = require('../helpers/error-wrapper');
const fnContacts = require('../contacts');

router.get(
  '/',
  errorWrapper(async (req, res) => {
    const list = await fnContacts.listContacts();
    return res.status(200).send(responseNormalizer(list));
  }),
);

router.get(
  '/:contactId',
  errorWrapper(async (req, res) => {
    const contactById = await fnContacts.getContactById(
      parseInt(req.params.contactId),
    );
    if (contactById) {
      return res.status(200).send(responseNormalizer(contactById));
    } else {
      const error = new Error();
      error.message = 'Not found';
      return res.status(404).send(responseNormalizer(error));
    }
  }),
);

router.post(
  '/',
  errorWrapper(async (req, res) => {
    const error = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().min(5).required(),
      phone: Joi.string().min(5).required(),
    }).validate(req.body);
    if (error.error) {
      error.error.message = 'missing required name field';
      return res.status(400).send(responseNormalizer(error.error));
    }
    const { name, email, phone } = req.body;
    const contactAdded = await fnContacts.addContact(name, email, phone);
    return res.status(201).send(responseNormalizer(contactAdded));
  }),
);

router.delete(
  '/:contactId',
  errorWrapper(async (req, res) => {
    const contactRemoved = await fnContacts.removeContact(
      parseInt(req.params.contactId),
    );
    if (contactRemoved) {
      const success = { message: 'contact deleted' };
      return res.status(200).send(responseNormalizer(success));
    } else {
      const error = new Error();
      error.message = 'Not found';
      return res.status(404).send(responseNormalizer(error));
    }
  }),
);

router.patch(
  '/:contactId',
  errorWrapper(async (req, res) => {
    const err = new Error();
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
      err.message = 'missing fields';
      return res.status(400).send(responseNormalizer(err));
    }
    const error = Joi.object({
      name: Joi.string().min(3),
      email: Joi.string().min(5),
      phone: Joi.string().min(5),
    }).validate(req.body);
    if (error.error || req.body.id) {
      error.error.message = 'fields incorrect';
      return res.status(400).send(responseNormalizer(error.error));
    }
    const contactUpdated = await fnContacts.updateContact(
      parseInt(req.params.contactId),
      req.body,
    );
    if (contactUpdated) {
      return res.status(200).send(responseNormalizer(contactUpdated));
    } else {
      err.message = 'Not found';
      return res.status(404).send(responseNormalizer(err));
    }
  }),
);

module.exports = router;
