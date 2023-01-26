const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const authenticate = (req, res, next) => {
    const login = auth(req);
    if (login === undefined) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="401"');
      res.end('Unauthorized');
    } else {
      User.findOne({username: login.username}, function(err, user) {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        }
        else if (!user) {
          res.statusCode = 401;
          res.setHeader('WWW-Authenticate', 'Basic realm="401"');
          res.end('Unauthorized');
        }
        else {
          bcrypt.compare(login.password, user.password, function(err, match) {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            }
            else if (!match) {
              res.statusCode = 401;
              res.setHeader('WWW-Authenticate', 'Basic realm="401"');
              res.end('Unauthorized');
            }
            else {
              req.username = user.username;
              next();
            }
          });
        }
      });
    }
  }

  module.exports = {
    authenticate
}