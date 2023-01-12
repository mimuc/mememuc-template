var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

const {User} = require('../db/models');


router.get('/', async function(req, res, next) {
  User.find({})
  .select('-password -basicauthtoken')
  .then((docs) => res.json(docs))
  .catch((e) => res.status(500).send())
});

router.get('/:username', async function(req, res, next) {
  const username  = req.params.username;
  User.findOne({ username })
  .select('-password -basicauthtoken')
  .then((docs) => res.json(docs))
  .catch((e) => res.status(500).send());
});

// TODO: DEBUG For user creation
router.post('/', async function(req, res) {
  const { username } = req.body;

  const existingUser = await User.findOne({ username });

  if (!existingUser) {
      const user = new User(req.body);
      user.save()
      .then(function() {
        res.status(201).json({ message: 'User created' });
      })
      .catch(function(error) {
          if (error.name === 'ValidationError') {
              res.status(400).send();
          } else {
              res.status(500).send();
          }
      });
      
  } else {
      res.status(400).json({ message: 'User already exists' });
  }
});

module.exports = router;
