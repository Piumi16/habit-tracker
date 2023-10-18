const express = require('express');

const authenticator = require('../middleware/check-auth');
const validator = require('../middleware/validator');
const habitController = require('../controllers/habit');

const router = express.Router();

router.post(
  '/',
  authenticator,
  validator(habitController.validationSchemas.createHabitSchema),
  habitController.handlers.createHabit
);
router.get('/', authenticator, habitController.handlers.getListOfUserHabits);
router.patch(
  '/:habit_id',
  authenticator,
  validator(habitController.validationSchemas.editHabitSchema),
  habitController.handlers.editHabit
);
router.delete(
  '/:habit_id',
  authenticator,
  validator(habitController.validationSchemas.deleteHabitSchema),
  habitController.handlers.deleteHabit
);
router.post(
  '/progress/:habit_id',
  authenticator,
  validator(habitController.validationSchemas.logHabitProgressSchema),
  habitController.handlers.logHabitProgress
);
router.get(
  '/progress/:date',
  authenticator,
  validator(habitController.validationSchemas.getHabitProgressOfDaySchema),
  habitController.handlers.getHabitProgressOfDay
);
router.post(
  '/predefined-habit',
  authenticator,
  validator(habitController.validationSchemas.createPredefinedHabitsSchema),
  habitController.handlers.createPredefinedHabits
);
router.patch(
  '/predefined-habit/:habit_id',
  authenticator,
  validator(habitController.validationSchemas.editPredefinedHabitsSchema),
  habitController.handlers.editPredefinedHabits
);
router.delete(
  '/predefined-habit/:habit_id',
  authenticator,
  validator(habitController.validationSchemas.deletePredefinedHabitsSchema),
  habitController.handlers.deletePredefinedHabit
);
router.get(
  '/predefined-habit',
  authenticator,
  habitController.handlers.getPredefinedHabit
);
router.get(
  '/:habit_id',
  authenticator,
  validator(habitController.validationSchemas.getUserHabitByIdSchema),
  habitController.handlers.getUserHabitById
);

module.exports = router;
