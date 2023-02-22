var express = require('express');
var router = express.Router();

const {authenticate} = require('../db/authentication');
const {User, Template} = require('../db/models');
const {handleGetMemeRequest} = require('../db/memeUtils');

const EXCLUDE_PROPERTIES = { password: 0, _id: 0, __v: 0 };

router.get('/', authenticate(), async function(req, res, next) {
  const username  = req.username;

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
  return res.json({...user.toObject(), likes: await user.getLikesCount(), likesReceived: await user.getLikesReceivedCount(), comments: await user.getCommentsCount(), commentsReceived: await user.getCommentsReceivedCount(), memes: await user.getMemesCount()});
});

router.get('/templates', authenticate(), async function(req, res, next) {
  const username  = req.username;

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

  Template.find({ creator: req.username }, { image: 0, _id: 0, __v: 0 })
  .then((docs) => res.json(docs))
  .catch((e) => res.status(500).send());
});

router.get('/memes', authenticate(), async function(req, res, next) {
  handleGetMemeRequest(req, res, 'json');
});

router.get('/memes/image', authenticate(), async function(req, res, next) {
  handleGetMemeRequest(req, res, 'image');
});

router.get('/memes/download', authenticate(), async function(req, res, next) {
  handleGetMemeRequest(req, res, 'zip');
});

router.get('/memes/single-view', authenticate(), async function(req, res, next) {
  handleGetMemeRequest(req, res, 'single-view');
});

module.exports = router;