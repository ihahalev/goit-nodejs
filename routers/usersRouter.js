const express = require('express');
const router = express.Router();

const { errorWrapper, multer, minifyImg } = require('../helpers');
const usersController = require('./usersController');
const authCheck = require('../middlewares/auth-check');

router.post('/auth/register', errorWrapper(usersController.createUser));

router.post('/auth/login', errorWrapper(usersController.loginUser));

router.post(
  '/auth/logout',
  errorWrapper(authCheck),
  errorWrapper(usersController.logoutUser),
);

router.get(
  '/current',
  errorWrapper(authCheck),
  errorWrapper(usersController.currentUser),
);

router.patch(
  '/',
  errorWrapper(authCheck),
  errorWrapper(usersController.updateSubscription),
);

router.patch(
  '/avatars',
  errorWrapper(authCheck),
  multer.single('avatar'),
  // minifyImg,
  errorWrapper(usersController.updateUser),
);

// router.get('/', errorWrapper(contastsController.getContacts));

// router.get('/:contactId', errorWrapper(contastsController.getContactById));

// router.delete('/:contactId', errorWrapper(contastsController.deleteContact));

// router.patch('/:contactId', errorWrapper(contastsController.updateContact));

module.exports = router;
