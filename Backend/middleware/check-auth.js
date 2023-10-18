const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const tokenData = jwt.verify(token, 'this_is_the_auth_token_key');
    req.user = {
      email: tokenData.email,
      user_id: tokenData.user_id,
      user_type: tokenData.user_type
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth failed!' });
  }
};
