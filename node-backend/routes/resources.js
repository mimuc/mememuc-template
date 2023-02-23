var express = require('express');
var router = express.Router();
const {authenticate} = require('../db/authentication');

const {Meme, Template, ImageResource} = require('../db/models');

router.get('/:type/:publicId', authenticate(false), async function(req, res, next) {
  const type = req.params.type;
  const publicId  = req.params.publicId;

  if(type === 'images') {

    if(publicId.startsWith('m')) {
      try {
        const doc = await Meme.findOne({ publicId });
        if (!doc) {
            return res.status(404).send('Image not found');
        }
        if ((doc.visibility === 'private') && req.username !== doc.creator ) {
          return res.status(401).send();
        }
        res.set('Content-Type', doc.contentType);
        res.send(doc.image);
      } catch (err) {
          res.status(500).send(err);
      }
    }
    else if(publicId.startsWith('i')) {
      try {
        const doc = await ImageResource.findOne({ publicId });
        if (!doc) {
            return res.status(404).send('Image not found');
        }
        if ((doc.visibility === 'private') && req.username !== doc.creator ) {
          return res.status(401).send();
        }
        res.set('Content-Type', doc.contentType);
        res.send(doc.image);
      } catch (err) {
          res.status(500).send(err);
      }
    }
    else {
      res.status(404).send();
    }
    
  }
  else {
    res.status(404).send();
  }
});

module.exports = router;