const express = require('express');
const router = express.Router();
const errorWrapper = require('../helpers/error-wrapper');
const contastsController = require('./contactsController');

router.get('/', errorWrapper(contastsController.getContacts));

router.get('/:contactId', errorWrapper(contastsController.getContactById));

router.post(
  '/',
  contastsController.validateCreateContact,
  errorWrapper(contastsController.createContact),
);

router.delete('/:contactId', errorWrapper(contastsController.deleteContact));

router.patch(
  '/:contactId',
  contastsController.validateUpdateContact,
  errorWrapper(contastsController.updateContact),
);

module.exports = router;
