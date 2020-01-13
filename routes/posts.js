const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { postValidation } = require('../utils/validation');
const { LIMIT_PER_PAGE, SKIP } = require('../constants/pagination');

router.get('/', async (req, res) => {
  const posts = await Post.find();

  res.send(posts);
});

router.get('/sort', async (req, res) => {
  const {
    role,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
    sortBy,
    page,
    content,
    ascending,
  } = req.query;

  const { user: _id } = req.headers;

  const pipeLine = [];
  const isAscending = ascending === 'true' ? 1 : -1;

  const timef = timeFrom || '00:00:00';
  const timet = timeTo || '23:59:59';
  
  if (dateFrom && dateTo) {
     pipeLine.push({
      $match: {
        date : {
          '$gte' : new Date(`${dateFrom}T${timef}`),
          '$lte' : new Date(`${dateTo}T${timet}`),
        }
      },
    })
  } else if (dateFrom)
      pipeLine.push({
        $match:
          {
            date :
            {
              '$gte' : new Date(`${dateFrom}T${timef}`)
            }
          }
      })
    else if (dateTo)
      pipeLine.push({
        $match:
          {
            date : { '$lte' : new Date(`${dateTo}T${timet}`) }
          }
      });

  if (role && role !== 'Admin')
    pipeLine.push({
      $match:
        {
          created_by: _id,
        }
    });

  if (sortBy)
    pipeLine.push({ $sort: { [sortBy]: isAscending } });

  if (page) {
    pipeLine.push({ $skip: SKIP(page) });
    pipeLine.push({ $limit: LIMIT_PER_PAGE });
  };

  if (content) pipeLine.push({
    $match :
    {
      $or: [
        {
          title:
            {
              $regex: content,
              $options: 'i',
            }
        },
        {
          body:
          {
            $regex: content,
            $options: 'i',
          }
        },
      ]}
  });

  if (!pipeLine[0])
    return res.send('Please, select at least one filter');

  console.log(JSON.stringify(pipeLine));

  const posts = await Post.aggregate(pipeLine);

  res.send(posts)
});


router.get('/author/:page', async (req, res) => {

  const { user: _id } = req.headers;
  const { page } = req.params;
  const { roles } = await User.findOne({ _id });

  const posts = await Post.aggregate([
      { $match: !roles.includes("Admin") ? { created_by: _id } : {} },
      {
        $lookup:
        {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "author_details",
        }
      },
      { '$unwind': { path: '$author_details', preserveNullAndEmptyArrays: true }},
      { '$unwind': { path: '$author_details.roles', preserveNullAndEmptyArrays: false }}, //to display deleted users add "preserveNullAndEmptyArrays: true"
      { '$addFields': { role: '$author_details.roles' } },
      { 
        '$group':
        { 
          _id: "$role",
          posts:
            {
              $push:
              {
                title: "$title",
                body: "$body",
              }
            }
        }
      },
      { $skip: SKIP(page) },
      { $limit: LIMIT_PER_PAGE },
    ])

  res.send(posts);

})

router.get('/:page', async (req, res) => {
  try {
    const { page } = req.params;
    console.log(Number.isInteger(page));
    if (Number.isInteger(page)) return res.send('Page must be a number');

    const { user: created_by } = req.headers;
    const { roles } = await User.findOne({_id: created_by});

    const posts = await Post.aggregate([
        { $match: !roles.includes("Admin") ? { created_by } : {} },
        { $skip: SKIP(page) },
        { $limit: LIMIT_PER_PAGE },
      ])

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
