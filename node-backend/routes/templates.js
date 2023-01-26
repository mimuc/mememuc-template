var express = require('express');
var router = express.Router();

const {Template, generateUrl} = require('../db/models');

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
  // TODO: Parse/upload image
  // TODO: Set creator field
  // TODO: Save text with positions

  const image = req.body.image;

  const existingTemplate = await Template.findOne({ name: req.body.name });

  if (!existingTemplate) {
      const template = new Template({
        name: req.body.name,
        image,
        visibility: req.body.visibility,    
        contentType: req.body.contentType,
        url: 't' + await generateUrl(Template)
      });
        
      template.save()
      .then(function() {
        res.status(201).json({ message: 'Template created' });
      })
      .catch(function(error) {
          if (error.name === 'ValidationError') {
              res.status(400).send();
          } else {
              res.status(500).send();
          }
      });
      
  } else {
      res.status(400).json({ message: 'Template already exists' });
  }
});


module.exports = router;
