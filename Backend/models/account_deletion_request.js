const mongoose = require('mongoose');

const accountDeletionRequestSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Account_Deletion_Request', accountDeletionRequestSchema);
