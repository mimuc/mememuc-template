var express = require('express');
var router = express.Router();

//Insert new User
router.post('/insert', function(req, res, next) {
  const db = req.db;
  if(db.get('users') === undefined) db.create("users");

  db.get('users').insert({
      user_name: req.body.user_name,
      time_stamp: req.body.time_stamp,
      password: req.body.password,
      email: req.body.email
  });
  res.status(200).send();
});

/* GET user by name */
router.post('/find', function(req, res, next) {
  const db = req.db;
  const users = db.get('users');
  users.find({user_name: req.body.user_name},{ projection: {basicauthtoken: 0}}) // return all user properties, except the basic auth token
      .then((docs) => {
        console.log("preparing json..");
        console.log(docs);
        res.json(docs);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
});

module.exports = router;
