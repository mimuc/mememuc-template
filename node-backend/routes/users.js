var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const db = req.db;
  const users = db.get('users');
  users.find({connexion_name: req.query.connexion_name}) // return all user properties, except the basic auth token
      .then((docs) => 
      {
        if(docs[0]){
      res.json(docs[0])
        }else(
          res.status(500).send()
        )
      } )
      .catch((e) => res.status(500).send())
});

/* look if username is in database  */
router.get('/lookinto', function(req, res, next) {
  const db = req.db;
  const users = db.get('users');
  users.find({connexion_name: req.query.username},{ projection: {basicauthtoken: 0} }) // return all user properties, except the basic auth token
      .then((docs) => res.json(docs[0]))
      .catch((e) => res.status(500).send())
});

router.post('/create', function(req, res, next) {
  const db = req.db;
  const name = req.query.username;
  const users = db.get('users');
  const model = {
    connexion_name: name,
    comments:[],
    posts: [],
    likes:[],
    dislikes:[]

  }
  users.insert(model) // return all user properties, except the basic auth token
      .then((result) => res.status(200).send("user created"))
      .catch((e) => res.status(500).send())
});

module.exports = router;
