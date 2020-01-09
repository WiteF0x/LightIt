const app = require('express')();
const cors = require('cors');

module.exports = app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
