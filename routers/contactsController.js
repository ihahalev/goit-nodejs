const Joi = require('joi');
const responseNormalizer = require('../normalizers/response-normalizer');
const ContactModel = require('../database/models/ContactModel');

class ContactController {
  async getContacts(req, res) {
    const { limit = 20, page = 0 } = req.query;
    const list = await ContactModel.find({})
      .sort({ name: 1 })
      .skip(Number.parseInt(limit) * Number.parseInt(page))
      .limit(Number.parseInt(limit));
    return res.status(200).send(responseNormalizer(list));
  }

  async getContactById(req, res) {
    const contactById = await ContactModel.findById(req.params.contactId);
    if (!contactById) {
      const error = new Error();
      error.message = 'Not found';
      return res.status(404).send(responseNormalizer(error));
    }
    return res.status(200).send(responseNormalizer(contactById));
  }

  async createContact(req, res) {
    const { name, email, phone, password, subscription, token } = req.body;
    const contactAdded = await ContactModel.create({
      name,
      email,
      phone,
      password,
      subscription,
      token,
    });
    return res.status(201).send(responseNormalizer(contactAdded));
  }

  async deleteContact(req, res) {
    const contactById = await ContactModel.findById(req.params.contactId);
    if (!contactById) {
      const error = new Error();
      error.message = 'Not found';
      return res.status(404).send(responseNormalizer(error));
    }
    contactById.remove();
    const success = { message: 'contact deleted' };
    return res.status(200).send(responseNormalizer(success));
  }

  async updateContact(req, res) {
    const contactUpdated = await ContactModel.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      { strict: true },
    );
    if (!contactUpdated) {
      err.message = 'Not found';
      return res.status(404).send(responseNormalizer(err));
    }
    return res.status(200).send(responseNormalizer(contactUpdated));
  }
}

module.exports = new ContactController();
