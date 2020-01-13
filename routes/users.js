const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { registerValidation } = require('../utils/validation');
const verifyUser = require('../utils/verifyUser');
const ROLES = require('../constants/roles');

router.post('/register', async (req, res) => {
  const { userName } = req.body;
  const { value, error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userNameExist = await User.findOne({ userName });
  if (userNameExist) return res.status(400).send('Username already exists');

  try {
    const newUser = await User.create(value);

    res.status(200).send({ success: true, newUser });

  } catch (err) {
    res.send({ message: err })
  }
});

router.post('/login', async (req, res) => {
  try {
    const { userName } = req.body;
    const user = await User.findOne({ userName });
  
    if (!user) res.status(401).send('Wrond login. Please, try again.');
    
    res.status(200).send(user);

  } catch (err) {
    res.send({ message: err });
  }
});

router.patch('/addRole', verifyUser, async (req, res) => {
  try {
    const { newRole } = req.body;
    const { user: _id } = req.headers;
    const { roles } = await User.findOne({_id});

    if (roles.includes(newRole)) return res.status(400).send('This role exists');
    if (!roles.includes(ROLES)) return res.status(404).send('Role not found.');

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: { roles: [...roles, newRole] } },
      { new: true }
    );

    res.status(200).send({success: true, updatedUser });

  } catch (err) {
    res.send({ message: err });
  }
});

module.exports = router;
