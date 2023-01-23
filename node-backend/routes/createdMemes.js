var express = require('express');
var router = express.Router();

// Link to gow to insert image
//https://stackoverflow.com/questions/44869479/what-data-type-should-i-use-to-store-an-image-with-mongodb


//Insert created Meme
router.post('/insert', function(req, res, next) {
  console.log("im backend");
    const db = req.db;
    if(db.get('createdMemes') === undefined) db.create("createdMemes");

    db.get('createdMemes').insert({
      image: req.body.image,
      imgWidth: req.body.imgWidth,
      imgHeight: req.body.imgHeight,
      text1: req.body.text1,
      text1XPos: req.body.text1XPos,
      text1YPos: req.body.text1YPos,
      text1Bold: req.body.text1Bold,
      text1Italic: req.body.text1Italic,
      text1Color: req.body.text1Color,
      text2Bold: req.body.text2Bold,
      text2XPos: req.body.text2XPos,
      text2YPos: req.body.text2YPos,
      text2Bold: req.body.text2Bold,
      text2Italic: req.body.text2Italic,
      text2Color: req.body.text2Color,
      title: req.body.title,
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