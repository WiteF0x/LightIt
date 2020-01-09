const express = require('express');
const router = express.Router();
const User = require('../modules/User');
const { registerValidation } = require('../utils/validation');

router.post('/register', async (req, res) => {
  const { userName } = req.body;
  const { value, error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userNameExist = await User.findOne({ userName });
  if (userNameExist) return res.status(400).send('Username already exists');

  try {
    const new_user = await User.create(value);
    res.send({ success: true, new_user });
  } catch (err) {
    res.send({ message: err })
  }
})

router.post('/login', async (req, res) => {
  const { userName } = req.body;
  const user = await User.findOne({ userName });

  if (!user) res.status(401).send('Wrond login. Please, try again.');
  
  res.status(200).send(user);
})

module.exports = router;
