const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  userName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: '',
  },
  postCode: {
    type: String,
    default: '',
  },
  roles: {
    type: Array,
    default: ['User'],
  }
});

module.exports = mongoose.model('User', UserSchema);
