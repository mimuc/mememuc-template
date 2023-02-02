var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

const {User, handleGetMemeRequest} = require('../db/models');

const EXCLUDE_PROPERTIES = { password: 0, _id: 0, __v: 0 };

router.get('/', async function(req, res, next) {
  User.find({}, EXCLUDE_PROPERTIES)
  .then((docs) => res.json(docs))
  .catch((e) => res.status(500).send());
});

router.get('/:username', async function(req, res, next) {
  const username  = req.params.username;
  let user;
  try {
    user = await User.findOne({ username }, EXCLUDE_PROPERTIES)
  }
  catch {
    return res.status(500).send();
  }
  if(!user) {
    return res.status(404).send("User not found");
  }
  return res.json({...user.toObject(), likesCount: await user.getLikesCount(), commentCount: await user.getCommentsCount(), memesCount: await user.getMemesCount()});
});

router.get('/:username/memes', async function(req, res, next) {
  const username  = req.params.username;

  let user;
  try {
    user = await User.findOne({ username }, EXCLUDE_PROPERTIES)
  }
  catch {
    return res.status(500).send();
  }
  if(!user) {
    return res.status(404).send("User not found");
  }
  req.query = {
    sort: 'newest',
    limit: req.query.limit ? req.query.limit : 10,
    creator: username,
    skip: req.query.skip ? req.query.skip : 0,
    return: 'json'
  };

  handleGetMemeRequest(req,res,next);
});


module.exports = router;
