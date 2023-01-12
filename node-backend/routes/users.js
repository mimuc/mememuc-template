var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

const {User} = require('../db/models');

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
  users.find({userId: req.params.userId},{ projection: {basicauthtoken: 0} }) // return all user properties, except the basic auth token
  .then((docs) => res.json(docs[0]))
  .catch((e) => res.status(500).send())
});

// TODO: DEBUG For user creation
router.post('/:userId', async function(req, res) {
  const db = req.db;
  //const users = db.get('users');

  const userId = req.params.userId;
  // TODO: or: const { userId } = req.body; ? 

  const existingUser = await User.findOne({ userId });

  if (!existingUser) {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: 'User created' });
  } else {
      res.status(400).json({ message: 'User already exists' });
  }
  /* const users = db.get('users');

  users.insert({
    userId: req.params.userId
  })
  .then((docs) => {
    console.log(docs);
    res.location(`/${userId}`);
    res.status(201).json(docs);
  })
  .catch((e) => res.status(500).send()); */
});

module.exports = router;
