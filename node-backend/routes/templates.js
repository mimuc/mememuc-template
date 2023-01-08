var express = require('express');
var router = express.Router();

/* GET templates listing. */
router.get('/', function(req, res, next) {
  const db = req.db;
  const templates = db.get('templates');

  templates.find() // return all user properties, except the basic auth token
      .then((docs) => res.json(docs))
      .catch((e) => res.status(500).send())
});

module.exports = router;
