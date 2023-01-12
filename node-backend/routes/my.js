router.get('/my', function(req, res, next) {
    const db = req.db;
    const users = db.get('users');
    if(!req.userId) req.userId = 'bob'; // TODO: DEBUG
    users.find({userId: req.userId},{ projection: {basicauthtoken: 0} }) // return all user properties, except the basic auth token
    .then((docs) => res.json(docs[0]))
    .catch((e) => res.status(500).send())
  });

  router.get('/my/templates', function(req, res, next) {
    const db = req.db;
    const users = db.get('users');
    if(!req.userId) req.userId = 'bob'; // TODO: DEBUG
    
    
    users.find({userId: req.userId},{ projection: {basicauthtoken: 0} }) // return all user properties, except the basic auth token
    .then((docs) => res.json(docs[0]))
    .catch((e) => res.status(500).send())
  });