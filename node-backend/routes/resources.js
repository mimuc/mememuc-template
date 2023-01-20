var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

const {Meme, Template} = require('../db/models');

router.get('/:type/:url', async function(req, res, next) {
  const type = req.params.type;
  const url  = req.params.url;
  console.log("REQUEST", type, url)
  if(type === 'images') {

    if(url.startsWith('m')) {
      try {
        const meme = await Meme.findOne({ url });
        if (!meme) {
            return res.status(404).send('Image not found');
        }
        res.set('Content-Type', meme.contentType);
        res.send(meme.image);
      } catch (err) {
          res.status(500).send(err);
      }
    }
    else if(url.startsWith('t')) {
      try {
        const template = await Template.findOne({ url });
        if (!template) {
            return res.status(404).send('Image not found');
        }
        res.set('Content-Type', template.contentType);
        res.send(template.image);
      } catch (err) {
          res.status(500).send(err);
      }
    }

    
  }
  else {
    res.status(404).send();
  }
});

module.exports = router;