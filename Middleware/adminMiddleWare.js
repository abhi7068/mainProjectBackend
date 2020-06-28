const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const authenticateJWTAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader) {
    // const token = authHeader.split(' ')[1];

    jwt.verify(authHeader, accessTokenSecret, (err) => {
      if (err) {
        return res.sendStatus(403);
      } else if (req.headers.isadmin === 'true') {
        next();
      } else {
        res.sendStatus(403);
      }
    });
  } else {
    res.sendStatus(401);
  }
};
module.exports = authenticateJWTAdmin;
