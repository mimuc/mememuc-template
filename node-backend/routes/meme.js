var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const db = req.db;
  const users = db.get('meme');
  //to create logic
});

module.exports = router;
