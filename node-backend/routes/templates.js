var express = require('express');
var router = express.Router();

const {Template} = require('../db/models');

router.get('/', async function(req, res, next) {
  Template.find({})
  .then((docs) => res.json(docs))
  .catch((e) => res.status(500).send())
});


module.exports = router;
