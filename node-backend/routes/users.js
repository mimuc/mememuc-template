var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const db = req.db;
  const users = db.get('users');
  users.find({},{ projection: {basicauthtoken: 0} }) // return all user properties, except the basic auth token
      .then((docs) => res.json(docs))
      .catch((e) => res.status(500).send())
});

router.get('/:userId', function(req, res, next) {
  const db = req.db;
  const users = db.get('users');
  users.find({username: req.params.userId},{ projection: {basicauthtoken: 0} }) // return all user properties, except the basic auth token
  .then((docs) => res.json(docs[0]))
  .catch((e) => res.status(500).send())
});

// TODO: DEBUG For user creation
router.post('/:userId', function(req, res) {
  const db = req.db;
  const users = db.get('users');
  users.insert({
    username: req.params.userId
  })
  .then((docs) => {
    console.log(docs);
    res.json(docs);
  })
  .catch((e) => res.status(500).send());
});

module.exports = router;
