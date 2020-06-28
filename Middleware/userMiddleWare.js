const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const authenticateJWTUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader) {
    jwt.verify(authHeader, accessTokenSecret, (err) => {
      if (err) {
        return res.sendStatus(403);
      } else if (req.headers.isadmin === 'false') {
        next();
      } else {
        res.sendStatus(403);
      }
    });
  } else {
    res.sendStatus(401);
  }
};
module.exports = authenticateJWTUser;
