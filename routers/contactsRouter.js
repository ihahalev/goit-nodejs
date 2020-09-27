const express = require('express');
const router = express.Router();
const errorWrapper = require('../helpers/error-wrapper');
const contastsController = require('./contactsController');
const authCheck = require('../middlewares/auth-check');

router.get(
  '/',
  errorWrapper(authCheck),
  errorWrapper(contastsController.getContacts),
);

router.get(
  '/:contactId',
  errorWrapper(authCheck),
  errorWrapper(contastsController.getContactById),
);

router.post(
  '/',
  errorWrapper(authCheck),
  errorWrapper(contastsController.createContact),
);

router.delete(
  '/:contactId',
  errorWrapper(authCheck),
  errorWrapper(contastsController.deleteContact),
);

router.patch(
  '/:contactId',
  errorWrapper(authCheck),
  errorWrapper(contastsController.updateContact),
);

module.exports = router;
