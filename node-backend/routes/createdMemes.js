var express = require('express');
var router = express.Router();

// Link to gow to insert image
//https://stackoverflow.com/questions/44869479/what-data-type-should-i-use-to-store-an-image-with-mongodb


//Insert created Meme
router.post('/insert', function(req, res, next) {
    const db = req.db;
    if(db.get('createdMemes') === undefined) db.create("createdMemes");

    db.get('createdMemes').insert({
        image_name: req.body.image_name,
        time_stamp: req.body.time_stamp,
        image_base_64: req.body.image_base_64,
        texts: req.body.texts
    });
    res.status(200).send();
  });

  /*
[
            {
                textNr: req.text_number
                textContent: req.text_contex,
                xPosition: req.xPosition,
                yPosition: req.yPosition,
                bold: req.bold,
                italic: req.italic,
                color: req.color
            }
        ] 
  */

// Get created meme
router.post('/find', function(req, res, next) {
    const db = req.db;
    const createdMemes = db.get('createdMemes');
    createdMemes.find({image_name: req.body.image_name},{ projection: {basicauthtoken: 0}}) // return all user properties, except the basic auth token
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