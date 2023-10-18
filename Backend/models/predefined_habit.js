const mongoose = require('mongoose');

const predefinedHabitSchema = mongoose.Schema({
  description: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true
  },
  target_value: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model('Predefined_Habit', predefinedHabitSchema);
