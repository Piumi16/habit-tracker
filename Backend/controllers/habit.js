const Joi = require('joi');
const moment = require('moment-timezone');

const User = require('../models/user');
const PredefinedHabit = require('../models/predefined_habit');
const UserHabit = require('../models/user_habit');
const UserHabitLog = require('../models/user_habit_log');

const createHabit = async (req, res) => {
  const { user_id } = req.user;
  const { name, target_value, description } = req.body;

  try {
    const habitDetails = await UserHabit.findOne({
      user_id,
      name,
    });
    if (habitDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Habit already Exists',
      });
    }

    const newHabitDetails = await UserHabit.create({
      user_id,
      name,
      target_value,
      description: description || null,
    });

    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: newHabitDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const getListOfUserHabits = async (req, res) => {
  const { user_id } = req.user;

  try {
    const habitDetails = await UserHabit.find({ user_id });
    if (habitDetails.length <= 0) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'No habits exists',
      });
    }
    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: habitDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const getUserHabitById = async (req, res) => {
  const { user_id } = req.user;
  const { habit_id } = req.params;
  try {
    const habitDetails = await UserHabit.findOne({
      _id: habit_id,
      user_id
    });

    if (!habitDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Habit does not exists or not assigned to this user ',
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: habitDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const editHabit = async (req, res) => {
  const { user_id } = req.user;
  const { name, target_value, description } = req.body;
  const { habit_id } = req.params;

  try {
    const habitDetails = await UserHabit.findOne({
      _id: habit_id,
      user_id,
    });
    if (!habitDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Habit does not exists or not assigned to this user',
      });
    }
    if (name) {
      const existingHabit = await UserHabit.findOne({
        name,
        user_id,
      });
      if (existingHabit) {
        return res.status(400).json({
          status_code: 400,
          message: 'error',
          error: 'Habit from this name already exists',
        });
      }
    }

    const habitObj = {
      name: name || habitDetails.name,
      target_value: target_value || habitDetails.target_value,
      description: description || habitDetails.description,
    };
    const updatedHabit = await UserHabit.findOneAndUpdate(
      { _id: habit_id },
      habitObj,
      { new: true }
    );

    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: updatedHabit,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const deleteHabit = async (req, res) => {
  const { user_id } = req.user;
  const { habit_id } = req.params;

  try {
    const habitDetails = await UserHabit.findOne({
      _id: habit_id,
      user_id,
    });
    if (!habitDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Habit does not exists or not assigned to this user ',
      });
    }

    await UserHabit.deleteOne({ _id: habit_id });
    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: 'Habit deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const logHabitProgress = async (req, res) => {
  const { completed_value } = req.body;
  const { user_id } = req.user;
  const { habit_id } = req.params;

  try {
    const habitDetails = await UserHabit.findOne({
      _id: habit_id,
      user_id,
    });
    if (!habitDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Habit does not exists or not assigned to this user ',
      });
    }

    const currentDateInIST = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const utcStartOfDay = moment.tz(currentDateInIST, 'Asia/Kolkata').startOf('day').utc().format('YYYY-MM-DD HH:mm:ss');
    const utcEndOfDay = moment.tz(currentDateInIST, 'Asia/Kolkata').endOf('day').utc().format('YYYY-MM-DD HH:mm:ss');

    const habitLog = await UserHabitLog.findOneAndUpdate(
      {
        user_habit_id: habit_id,
        log_date: { $gte: utcStartOfDay, $lte: utcEndOfDay }
      },
      {
        completed_value,
        user_id,
        name: habitDetails.name,
        log_date: currentDateInIST
      },
      {
        new: true,
        upsert: true
      }
    );

    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: habitLog,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const getHabitProgressOfDay = async (req, res) => {
  const { user_id } = req.user;
  const { date } = req.params;

  try {
    const userDetails = await User.findById(user_id);
    if (!userDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'User does not exists',
      });
    }

    const istDate = date || moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
    const utcStartOfDay = moment.tz(istDate, 'Asia/Kolkata').startOf('day').utc().format('YYYY-MM-DD HH:mm:ss');
    const utcEndOfDay = moment.tz(istDate, 'Asia/Kolkata').endOf('day').utc().format('YYYY-MM-DD HH:mm:ss');

    const habitLogs = await UserHabitLog.find({
      user_id,
      log_date: { $gte: utcStartOfDay, $lte: utcEndOfDay }
    });

    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: habitLogs,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const createPredefinedHabits = async (req, res) => {
  const { user_type } = req.user;
  const { description, name, target_value } = req.body;

  try {
    if (user_type !== 'admin') {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'You do not have permission for this',
      });
    }
    const habitDetails = await PredefinedHabit.findOne({ name });

    if (habitDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Habit already Exists',
      });
    }

    const newHabitDetails = await PredefinedHabit.create({
      name,
      target_value,
      description: description || null,
    });

    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: newHabitDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const editPredefinedHabits = async (req, res) => {
  const { name, target_value, description } = req.body;
  const { habit_id } = req.params;
  const { user_type } = req.user;

  try {
    if (user_type !== 'admin') {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'You do not have permission for this',
      });
    }
    const habitDetails = await PredefinedHabit.findOne({
      _id: habit_id,
    });

    if (!habitDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Habit does not exists',
      });
    }

    if (name) {
      const existingHabit = await PredefinedHabit.findOne({
        name,
      });
      if (existingHabit) {
        return res.status(400).json({
          status_code: 400,
          message: 'error',
          error: 'Habit from this name already exists',
        });
      }
    }

    const habitObj = {
      name: name || habitDetails.name,
      target_value: target_value || habitDetails.target_value,
      description: description || habitDetails.description,
    };
    const updatedHabit = await PredefinedHabit.findOneAndUpdate(
      { _id: habit_id },
      habitObj,
      { new: true }
    );

    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: updatedHabit,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const deletePredefinedHabit = async (req, res) => {
  const { habit_id } = req.params;
  const { user_type } = req.user;

  try {
    if (user_type !== 'admin') {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'You do not have permission for this',
      });
    }
    const habitDetails = await PredefinedHabit.findOne({
      _id: habit_id,
    });
    if (!habitDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Habit does not exists',
      });
    }

    await PredefinedHabit.deleteOne({ _id: habit_id });
    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: 'Habit deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const getPredefinedHabit = async (req, res) => {
  const { user_type } = req.user;

  try {
    if (user_type !== 'admin') {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'You do not have permission for this',
      });
    }
    const habitDetails = await PredefinedHabit.find();
    if (!habitDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Habits does not exists',
      });
    }
    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: habitDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const createHabitSchema = {
  body: Joi.object({
    description: Joi.string().allow(''),
    name: Joi.string().required(),
    target_value: Joi.number().required(),
  })
};

const createPredefinedHabitsSchema = {
  body: Joi.object({
    description: Joi.string().allow(null, ''),
    name: Joi.string().required(),
    target_value: Joi.number().required(),
  })
};

const editPredefinedHabitsSchema = {
  body: Joi.object({
    description: Joi.string().allow(null, ''),
    name: Joi.string(),
    target_value: Joi.number(),
  }),
  params: Joi.object({
    habit_id: Joi.string().required(),
  })
};

const deletePredefinedHabitsSchema = {
  params: Joi.object({
    habit_id: Joi.string().required(),
  })
};

const getUserHabitByIdSchema = {
  params: Joi.object({
    habit_id: Joi.string().required(),
  })
};

const editHabitSchema = {
  body: Joi.object({
    description: Joi.string().allow(null, ''),
    name: Joi.string(),
    target_value: Joi.number(),
  }),
  params: Joi.object({
    habit_id: Joi.string().required(),
  })
};

const deleteHabitSchema = {
  params: Joi.object({
    habit_id: Joi.string().required(),
  })
};

const logHabitProgressSchema = {
  body: Joi.object({
    completed_value: Joi.number(),
  }),
  params: Joi.object({
    habit_id: Joi.string().required(),
  })
};

const getHabitProgressOfDaySchema = {
  params: Joi.object({
    date: Joi.string().required(),
  })
};

module.exports = {
  handlers: {
    createHabit,
    getListOfUserHabits,
    getUserHabitById,
    editHabit,
    deleteHabit,
    logHabitProgress,
    getHabitProgressOfDay,
    createPredefinedHabits,
    editPredefinedHabits,
    deletePredefinedHabit,
    getPredefinedHabit
  },
  validationSchemas: {
    createHabitSchema,
    createPredefinedHabitsSchema,
    editPredefinedHabitsSchema,
    deletePredefinedHabitsSchema,
    getUserHabitByIdSchema,
    editHabitSchema,
    deleteHabitSchema,
    logHabitProgressSchema,
    getHabitProgressOfDaySchema
  }
};
