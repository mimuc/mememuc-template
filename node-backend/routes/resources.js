var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

const {Meme, Template} = require('../db/models');

router.get('/:type/:publicId', async function(req, res, next) {
  const type = req.params.type;
  const publicId  = req.params.publicId;
  // TODO: CHeck permissions

  if(type === 'images') {

    if(publicId.startsWith('m')) {
      try {
        const meme = await Meme.findOne({ publicId });
        if (!meme) {
            return res.status(404).send('Image not found');
        }
        res.set('Content-Type', meme.contentType);
        res.send(meme.image);
      } catch (err) {
          res.status(500).send(err);
      }
    }
    else if(publicId.startsWith('t')) {
      try {
        const template = await Template.findOne({ publicId });
        if (!template) {
            return res.status(404).send('Image not found');
        }
        res.set('Content-Type', template.contentType);
        res.send(template.image);
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