const express = require('express');
const router = express.Router();
const { errorWrapper } = require('../helpers');
const usersController = require('./usersController');

router.post('/auth/register', errorWrapper(usersController.createUser));

router.post('/auth/login', errorWrapper(usersController.loginUser));

// router.get('/', errorWrapper(contastsController.getContacts));

// router.get('/:contactId', errorWrapper(contastsController.getContactById));

// router.delete('/:contactId', errorWrapper(contastsController.deleteContact));

// router.patch('/:contactId', errorWrapper(contastsController.updateContact));

module.exports = router;
