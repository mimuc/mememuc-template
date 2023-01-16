var express = require('express');
var router = express.Router();
const { createHash } = require('crypto');

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

//Insert new User
router.post('/insert', function(req, res, next) {
    console.log(req.body);
    const db = req.db;
    if(db.get('users') === undefined) db.create("users");

    db.get('users').insert({
        username: req.body.username,
        timestamp: req.body.timestamp,
        password: hash(req.body.password),
        email: req.body.email
    });
    res.status(200).send();
});

router.post('/auth', function(req, res) {
    const db = req.db;
    const req_username = req.body.username;
    const req_password = req.body.password;

    if(req_username && req_password) {
       db.get('users').find({ username: req_username }).then((docs) => {
           if(docs.length > 0) {
               //res.send('Correct username');
               if(docs[0].password === hash(req_password)) {
                   res.send('Logged in');
                   req.session.loggedin = true;
                   req.session.username = req_username;
               }
               else {
                   res.send('Wrong password');
                   res.end();
               }
           }
           else {
               res.send('Incorrect username');
           }
           res.end();
       })
    } else {
        res.send('Plese log in');
        res.end();
    }
});

/* GET user by name */
router.post('/find', function(req, res, next) {
    console.log("finding user");
  const db = req.db;
  const users = db.get('users');
  console.log("loaded from db");
  users.find({username: req.body.username},{ projection: {basicauthtoken: 0}}) // return all user properties, except the basic auth token
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
