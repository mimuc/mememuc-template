var express = require('express');
var router = express.Router();
const axios = require('axios');

const {Template, generatePublicId} = require('../db/models');

router.get('/', async function(req, res, next) {
  // TODO: Restrict GET to templates the user can see
  Template.find({})
  .then((docs) => res.json(docs))
  .catch((e) => res.status(500).send())
});

router.get('/:name', async function(req, res, next) {
  // TODO: Throw error if the user has no permission to see the template
  const name  = req.params.name;
  Template.findOne({ name })
  .then((docs) => res.json(docs))
  .catch((e) => res.status(500).send());
});

router.post('/', async function(req, res) {
  // TODO: Requires authentication, uses username as creator
  // TODO: Set creator field
  // TODO: Save text with positions

  if(!req.body.image && !req.body.url) {
    res.status(400).json({ message: 'Please define a url or a base64 image to upload!' });
    return;
  }
  
  const templateData = {
    name: req.body.name,
    visibility: req.body.visibility,
    image: req.body.image,
    texts: req.body.texts
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
  
  templateData.publicId = 't' + await generatePublicId(Template);
  
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
