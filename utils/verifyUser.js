const User = require('../modules/User');

module.exports = async function(req, res, next) {
  const user_id = req.header('user');
  if (!user_id) return res.status(401).send('Access Denied');

  try {
    const confirm_user = await User.findById(user_id);
    if (confirm_user) next();

    return res.status(400).send('User not found! Access Denied')
  } catch (err) {
      res.status(400).send('Invalid User');
  }
};
