var express = require('express');
var router = express.Router();
const axios = require('axios');
const {authenticate} = require('../db/authentication');

const {Template} = require('../db/models');

const EXCLUDE_PROPERTIES = { image: 0, _id: 0, __v: 0 };

router.get('/', authenticate(false), async function(req, res, next) {

  Template.find({
    $or: [
      { visibility: 'public' },
      { visibility: { $in: ['private', 'unlisted'] }, creator: req.username }
    ]
  }, EXCLUDE_PROPERTIES)
  .then((docs) => res.json(docs))
  .catch((e) => res.status(500).send())
});

router.get('/:name', authenticate(false), async function(req, res, next) {
  const name  = req.params.name;
  Template.findOne({ name }, EXCLUDE_PROPERTIES)
  .then((doc) => {
    if (!doc) {
      return res.status(404).send({ error: "Template not found" });
    }
    if ((doc.visibility === 'private') && req.username !== doc.creator ) {
      return res.status(401).send();
    }
    return res.json(doc);
  })
  .catch((e) => res.status(500).send());
});

router.post('/', authenticate(), async function(req, res) {
  // TODO: Save text with positions

  if(!req.body.image && !req.body.url) {
    res.status(400).json({ message: 'Please define a url or a base64 image to upload!' });
    return;
  }
  
  const templateData = {
    name: req.body.name,
    visibility: req.body.visibility,
    image: req.body.image,
    texts: req.body.texts,
    creator: req.username
  }

  const existingTemplate = await Template.findOne({ name: templateData.name });
  if(existingTemplate) {
    res.status(400).json({ message: 'Template already exists.' });
    return;
  }

  if(!templateData.image && req.body.url) {
    try {
      const response = await axios.get(req.body.url, {responseType: 'arraybuffer'});
      const imageBuffer = new Buffer.from(response.data, 'binary');
      templateData.image = imageBuffer;
      templateData.contentType = response.headers['content-type'];
    } catch (error) {
      res.status(400).send("The image could not be loaded: " + req.body.url);
      return;
    }
  }
  else {
    templateData.contentType = templateData.image.split(',')[0].split(':')[1].split(';')[0];
    templateData.image = Buffer.from(templateData.image, 'base64');
  }
  
  templateData.publicId = await Template.generatePublicId();
  
  const template = new Template(templateData);
    
  template.save()
  .then(function() {
    res.status(201).json({ message: 'Template created', url: `${req.protocol}://${req.get('host')}/resources/images/${template.publicId}`});
  })
  .catch(function(error) {
      if (error.name === 'ValidationError') {
          res.status(400).send("The template data could not be validated.");
      } else {
          res.status(500).send();
      }
  });
      

});


module.exports = router;
