const {authenticate} = require('../db/authentication');

router.get('/my', authenticate, function(req, res, next) {
    const db = req.db;
    const users = db.get('users');
    if(!req.username) req.username = 'bob'; // TODO: DEBUG
    users.find({username: req.username},{ projection: {basicauthtoken: 0} }) // return all user properties, except the basic auth token
    .then((docs) => res.json(docs[0]))
    .catch((e) => res.status(500).send())
  });

  router.get('/my/templates', authenticate, function(req, res, next) {
    const db = req.db;
    const users = db.get('users');
    if(!req.username) req.username = 'bob'; // TODO: DEBUG
    
    
    users.find({username: req.username},{ projection: {basicauthtoken: 0} }) // return all user properties, except the basic auth token
    .then((docs) => res.json(docs[0]))
    .catch((e) => res.status(500).send())
  });