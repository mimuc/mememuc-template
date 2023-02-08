const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../db/models');


const authenticate = (isRequired = true) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) {
    if(!isRequired) return next();
    
    return res.status(401).send({ message: 'No authorization header provided' });
  }

  // Token authentication
  if (authHeader.startsWith("Bearer")) {
    const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(401).send({ message: 'Token is not valid' });
        }

        req.username = user.username;
        return next();
    } catch (err) {
      return res.status(401).send({ message: 'Token is not valid' });
    }
  } else if(authHeader.startsWith("Basic")) { // Basic authentication
    const login = auth(req);

    if (!login || !login.name || !login.pass) {
        return res.status(401).send({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username: login.name });
    if (!user) {
        return res.status(401).send({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(login.pass, user.password);
    if (!isMatch) {
        return res.status(401).send({ message: 'Invalid username or password' });
    }

    req.username = user.username;
    return next();
  }
  else res.status(401).send("Invalid authorization header provided");
}


  module.exports = {
    authenticate
}