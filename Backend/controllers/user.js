const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const User = require('../models/user');
const AccountDeletionRequest = require('../models/account_deletion_request');
const PredefinedHabit = require('../models/predefined_habit');
const UserHabit = require('../models/user_habit');
const Admin = require('../models/admin');
const HelpCenterQuestion = require('../models/help_center_question');

const signup = async (req, res) => {
  const {
    password, email, name, age, height, weight, job_type
  } = req.body;
  try {
    const existingUSer = await User.find({ email });
    if (existingUSer.length > 0) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'User already Exists',
      });
    }
    const adminDetails = await Admin.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = {
      email,
      password: hashedPassword,
      user_type: adminDetails ? 'admin' : 'general_user',
      name,
      age,
      height,
      weight,
      job_type
    };
    const userDetails = await User.create(userObj);
    const predefinedHabits = await PredefinedHabit.find();

    if (predefinedHabits && !adminDetails) {
      predefinedHabits.forEach(async (habit) => {
        await UserHabit.create({
          user_id: userDetails._id,
          name: habit.name,
          target_value: habit.target_value,
          description: habit.description,
        });
      });
    }
    return res.status(200).json({
      status_code: 200,
      message: 'Success',
      result: {
        email: userDetails.email,
        name: userDetails.name,
        user_type: userDetails.user_type,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { password, email } = req.body;

  try {
    const userDetails = await User.findOne({ email });

    if (!userDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Auth failed',
      });
    }
    const hashedPassword = await bcrypt.compare(password, userDetails.password);

    if (!hashedPassword) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'Auth failed',
      });
    }
    const token = jwt.sign(
      { email, user_id: userDetails._id, user_type: userDetails.user_type },
      'this_is_the_auth_token_key',
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      status_code: 200,
      message: 'success',
      data: {
        token,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const editUserProfile = async (req, res) => {
  const { user_id } = req.user;
  const {
    name, height, weight, age, job_type
  } = req.body;

  try {
    const userDetails = await User.findById(user_id);
    if (!userDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'No user found',
      });
    }

    const userObj = {
      name: name || userDetails.name,
      age: age || userDetails.age,
      height: height || userDetails.height,
      weight: weight || userDetails.weight,
      job_type: job_type || userDetails.job_type,
    };

    const updatedUserDetails = await User.findOneAndUpdate(
      { _id: user_id },
      userObj,
      { new: true }
    );
    const { password, ...filteredData } = updatedUserDetails._doc;
    return res.status(200).json({
      status_code: 200,
      message: 'success',
      data: filteredData,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const sendAccountDeletionRequest = async (req, res) => {
  const { email, user_id } = req.user;
  const { description } = req.body;

  try {
    const userDetails = await User.findById(user_id);
    if (!userDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'No user found',
      });
    }

    const userObj = {
      email,
      user_id,
      name: userDetails.name,
      description: description || null,
    };

    const deletionRequest = await AccountDeletionRequest.create(userObj);

    return res.status(200).json({
      status_code: 200,
      message: 'success',
      data: deletionRequest,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const getUserDetails = async (req, res) => {
  const { user_id } = req.user;

  try {
    const userDetails = await User.findById(user_id);
    if (!userDetails) {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'No user found',
      });
    }

    const { password, ...filteredData } = userDetails._doc;

    return res.status(200).json({
      status_code: 200,
      message: 'success',
      data: filteredData,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const getAccountDeletionRequests = async (req, res) => {
  const { user_type } = req.user;

  try {
    if (user_type !== 'admin') {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'You do not have permission for this',
      });
    }

    const deletionRequests = await AccountDeletionRequest.find();
    return res.status(200).json({
      status_code: 200,
      message: 'success',
      data: deletionRequests,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  const { user_type } = req.user;
  const { user_id } = req.params;

  try {
    if (user_type !== 'admin') {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'You do not have permission for this',
      });
    }

    await AccountDeletionRequest.deleteOne({ user_id });
    await User.deleteOne({ _id: user_id });
    return res.status(200).json({
      status_code: 200,
      message: 'success',
      data: 'Account deletion successful',
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const contactHelp = async (req, res) => {
  const { email, question, name } = req.body;

  try {
    const questionDetails = await HelpCenterQuestion.create({
      name,
      email,
      question
    });
    return res.status(200).json({
      status_code: 200,
      message: 'success',
      data: questionDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const getHelpCenterQuestions = async (req, res) => {
  const { user_type } = req.user;

  try {
    if (user_type !== 'admin') {
      return res.status(400).json({
        status_code: 400,
        message: 'error',
        error: 'You do not have permission for this',
      });
    }
    const questions = await HelpCenterQuestion.find();
    return res.status(200).json({
      status_code: 200,
      message: 'success',
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'error',
      error: error.message,
    });
  }
};

const signupSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    age: Joi.number(),
    height: Joi.number(),
    weight: Joi.number(),
    job_type: Joi.string(),
  })
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })
};

const editUserProfileSchema = {
  body: Joi.object({
    name: Joi.string(),
    age: Joi.number(),
    height: Joi.number(),
    weight: Joi.number(),
    job_type: Joi.string(),
  })
};

const sendAccountDeletionRequestSchema = {
  body: Joi.object({
    description: Joi.string(),
  })
};

const deleteAccountSchema = {
  params: Joi.object({
    user_id: Joi.string().required(),
  })
};

const contactHelpSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    question: Joi.string().required(),
  })
};

module.exports = {
  handlers: {
    signup,
    login,
    editUserProfile,
    sendAccountDeletionRequest,
    getAccountDeletionRequests,
    deleteAccount,
    getUserDetails,
    contactHelp,
    getHelpCenterQuestions
  },
  validationSchemas: {
    signupSchema,
    loginSchema,
    editUserProfileSchema,
    sendAccountDeletionRequestSchema,
    deleteAccountSchema,
    contactHelpSchema
  }
};
