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

router.get('/:userId', async function(req, res, next) {
  const userId  = req.params.userId;
  User.findOne({ userId })
  .select('-password -basicauthtoken')
  .then((docs) => res.json(docs[0]))
  .catch((e) => res.status(500).send());
});

// TODO: DEBUG For user creation
router.post('/', async function(req, res) {
  const { userId } = req.body;

  const existingUser = await User.findOne({ userId });

  if (!existingUser) {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: 'User created' });
  } else {
      res.status(400).json({ message: 'User already exists' });
  }
});

module.exports = router;
