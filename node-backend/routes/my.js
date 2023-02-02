var express = require('express');
var router = express.Router();

const {authenticate} = require('../db/authentication');
const {User, Template, handleGetMemeRequest} = require('../db/models');

const EXCLUDE_PROPERTIES = { password: 0, _id: 0, __v: 0 };

router.get('/', authenticate(), async function(req, res, next) {
  const username  = req.username;
  if(!username) res.status(401).send();

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

router.get('/templates', authenticate(), async function(req, res, next) {
  const username  = req.username;
  if(!username) res.status(401).send();

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
  const username  = req.username;
  if(!username) res.status(401).send();

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