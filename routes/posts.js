const express = require('express');
const router = express.Router();
const Post = require('../modules/Post');
const User = require('../modules/User');
const { postValidation } = require('../utils/validation');

router.get('/', async (req, res) => {
  let posts;

  try {
    const { user: created_by } = req.headers;
  
    const { roles } = await User.findOne({_id: created_by});

    if (!roles.includes("Admin")) {
      posts = await Post.find({ created_by });
    }  else {
      posts = await Post.find();
    }

    res.send(posts);

  } catch (err) {
    res.send({ message: err })
  }
});

router.post('/', async (req, res) => {
  const { user: created_by } = req.headers;
  const { value, error } = postValidation({ ...req.body, created_by });
  if (error) return res.status(400).send(error.details[0].message);

  const new_post = await Post.create(value);

  res.send({ success: true, post: new_post });

});

module.exports = router;
