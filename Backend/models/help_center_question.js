const mongoose = require('mongoose');

const helpCenterQuestionSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Help_Center_Questions', helpCenterQuestionSchema);
