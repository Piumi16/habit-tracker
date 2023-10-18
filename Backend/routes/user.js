const express = require('express');

const userController = require('../controllers/user');
const validator = require('../middleware/validator');
const authenticator = require('../middleware/check-auth');

const router = express.Router();

router.post(
  '/signup',
  validator(userController.validationSchemas.signupSchema),
  userController.handlers.signup
);
router.post(
  '/login',
  validator(userController.validationSchemas.loginSchema),
  userController.handlers.login
);
router.patch(
  '/profile',
  authenticator,
  validator(userController.validationSchemas.editUserProfileSchema),
  userController.handlers.editUserProfile
);
router.get(
  '/profile',
  authenticator,
  userController.handlers.getUserDetails
);
router.post(
  '/profile/delete-request',
  authenticator,
  validator(userController.validationSchemas.sendAccountDeletionRequestSchema),
  userController.handlers.sendAccountDeletionRequest
);
router.get(
  '/profile/delete-requests',
  authenticator,
  userController.handlers.getAccountDeletionRequests
);
router.delete(
  '/profile/:user_id',
  authenticator,
  validator(userController.validationSchemas.deleteAccountSchema),
  userController.handlers.deleteAccount
);

router.post(
  '/help-center',
  validator(userController.validationSchemas.contactHelpSchema),
  userController.handlers.contactHelp
);

router.get(
  '/help-center',
  authenticator,
  userController.handlers.getHelpCenterQuestions
);

module.exports = router;
