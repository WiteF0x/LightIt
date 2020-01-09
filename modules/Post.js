const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Post', PostSchema);
