const mongoose = require('mongoose');

const userHabitSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  target_value: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('User_Habit', userHabitSchema);
