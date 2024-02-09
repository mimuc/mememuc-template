var express = require('express');
var router = express.Router();

/* GET meme listing. */
router.get('/', function(req, res, next) {
  const db = req.db;
  const memes = db.get('meme');
  //logic to be created
});

module.exports = router;
