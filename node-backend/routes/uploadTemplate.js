var express = require('express');
var router = express.Router();


router.post('/insert', function(req, res, next) {
    const db = req.db;
    //console.log(db);
    //console.log(db.users);
    if(db.get('templates') === undefined) db.create("templates");

    db.get('templates').insert({
        author: req.author,
        time_stamp: req.body.time_stamp,
        image_name: req.body.image_name,
        image_base_64: req.body.image_base_64
    });
    res.status(200).send();
  });

  
/* GET users listing. */
router.post('/find', function(req, res, next) {
    const db = req.db;
    const templates = db.get('templates');
    templates.find({image_name: req.body.image_name},{ projection: {basicauthtoken: 0}}) // return all user properties, except the basic auth token
        .then((docs) => {
          console.log("preparing json..");
          console.log(docs);
          res.json(docs);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).send();
        });
  });


module.exports = router;
