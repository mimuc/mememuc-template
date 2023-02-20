var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

const {User} = require('../db/models');
const {authenticate} = require('../db/authentication');

const {handleGetMemeRequest} = require('../db/memeUtils');

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

router.get('/:username/memes', authenticate(false), async function(req, res, next) {
  handleGetMemeRequest(req, res, 'json');
});

router.get('/:username/memes/image', authenticate(false), async function(req, res, next) {
  handleGetMemeRequest(req, res, 'image');
});

router.get('/:username/memes/download', authenticate(false), async function(req, res, next) {
  handleGetMemeRequest(req, res, 'zip');
});

router.get('/:username/memes/single-view', authenticate(false), async function(req, res, next) {
  handleGetMemeRequest(req, res, 'single-view');
});

module.exports = router;
