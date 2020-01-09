const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./utils/cors');
require('./config/mongoose');

const verifyUser = require('./utils/verifyUser');

//Routes
const postsRoute = require('./routes/posts');
const usersRoute = require('./routes/users');

app.use(bodyParser.json());

app.use('/posts', verifyUser);

app.use('/posts', postsRoute);
app.use('/users', usersRoute);

app.get('/', (req, res) => {
  res.send('Home page');
})

app.listen(8000);
