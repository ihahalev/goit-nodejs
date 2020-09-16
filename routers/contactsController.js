const Joi = require('joi');
const responseNormalizer = require('../normalizers/response-normalizer');
// const fnContacts = require('../contacts');
const configEnv = require('../config.env');
const mongodb = require('mongodb');
const connection = require('../database/Connection');

class ContactController {
  async getContacts(req, res) {
    const { limit = 100 } = req.query;
    const collection = connection.getCollection();
    const list = await collection
      .find({})
      .sort({ name: 1 })
      .limit(limit)
      .toArray(); //fnContacts.listContacts();
    return res.status(200).send(responseNormalizer(list));
  }

  async getContactById(req, res) {
    const collection = connection.getCollection();
    const contactById = await collection.findOne(
      mongodb.ObjectID(req.params.contactId),
    ); // fnContacts.getContactById(parseInt(req.params.contactId));
    if (contactById) {
      return res.status(200).send(responseNormalizer(contactById));
    } else {
      const error = new Error();
      error.message = 'Not found';
      return res.status(404).send(responseNormalizer(error));
    }
  }

  async createContact(req, res) {
    const { name, email, phone } = req.body;
    const collection = connection.getCollection();
    const contactAdded = await collection.insertOne({ name, email, phone }); // fnContacts.addContact(name, email, phone);
    return res.status(201).send(responseNormalizer(contactAdded));
  }

  async deleteContact(req, res) {
    const collection = connection.getCollection();
    const contactRemoved = await collection.deleteOne({
      _id: mongodb.ObjectID(req.params.contactId),
    }); //fnContacts.removeContact(parseInt(req.params.contactId));
    if (contactRemoved) {
      const success = { message: 'contact deleted' };
      return res.status(200).send(responseNormalizer(success));
    } else {
      const error = new Error();
      error.message = 'Not found';
      return res.status(404).send(responseNormalizer(error));
    }
  }

  async updateContact(req, res) {
    const collection = connection.getCollection();
    const contactUpdated = await collection.updateOne(
      { _id: mongodb.ObjectID(req.params.contactId) },
      { $set: req.body },
    ); //fnContacts.updateContact(parseInt(req.params.contactId), req.body);
    if (contactUpdated) {
      return res.status(200).send(responseNormalizer(contactUpdated));
    } else {
      err.message = 'Not found';
      return res.status(404).send(responseNormalizer(err));
    }
  }

  async validateCreateContact(req, res, next) {
    const error = await Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().min(5).required(),
      phone: Joi.string().min(5).required(),
    }).validateAsync(req.body);
    if (error.error) {
      error.error.message = 'missing required name field';
      return res.status(400).send(responseNormalizer(error.error));
    }
    next();
  }

  async validateUpdateContact(req, res, next) {
    const err = new Error();
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
      err.message = 'missing fields';
      return res.status(400).send(responseNormalizer(err));
    }
    const error = await Joi.object({
      name: Joi.string().min(3),
      email: Joi.string().min(5),
      phone: Joi.string().min(5),
    }).validateAsync(req.body);
    if (error.error) {
      error.error.message = 'fields incorrect';
      return res.status(400).send(responseNormalizer(error.error));
    }
    next();
  }
}

module.exports = new ContactController();
