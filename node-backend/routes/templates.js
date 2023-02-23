var express = require('express');
var router = express.Router();
const axios = require('axios');
const {authenticate} = require('../db/authentication');

const {Template, ImageResource} = require('../db/models');

const EXCLUDE_PROPERTIES = { _id: 0, __v: 0 };

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

router.delete('/:name', authenticate(), async function(req, res, next) {
  const username = req.username;
  const name  = req.params.name;

  const template = await Template.findOneAndDelete({ creator: username, name })
  .catch(function(error) {
      res.status(500).send();
  }); 

  if(template) return res.status(200).send();
  else return res.status(404).send("Template not found");
});

router.post('/', authenticate(), async function(req, res) {
  if(req.body.images == undefined && req.body.urls == undefined) {
    res.status(400).send('Please define a list of image urls or base64 images to upload');
    return;
  }

  if(req.body.name == undefined) {
    res.status(400).send('Please define a unique name for the template')
  }
  
  const templateData = {
    name: req.body.name,
    visibility: req.body.visibility,
    images: [],
    canvas: req.body.canvas,
    texts: req.body.texts,
    creator: req.username
  }

  if (!['unlisted', 'private', 'public'].includes(templateData.visibility)) {
    templateData.visibility = 'public';
  }

  const existingTemplate = await Template.findOne({ name: templateData.name });
  if(existingTemplate) {
    res.status(409).send(`Template with name ${templateData.name} already exists`);
    return;
  }

  let publicIdSet = new Set();
  for (const img of req.body.images) {
    if(img.url == undefined) continue;
    
    let imageBuffer;
    let contentType;

    if(img.url.startsWith('data:image/')) { // image.url is base64
      const base64Data = img.url.split(',')[1];
      contentType = base64ImageString.split(';')[0].split(':')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    }
    else { // image.url is an actual url
        try {
          const response = await axios.get(img.url, {responseType: 'arraybuffer'});
          imageBuffer = new Buffer.from(response.data, 'binary');
          contentType = response.headers['content-type']
        } catch (error) {
            console.error(error);
            return res.status(400).send("The image could not be loaded: " + img.url);
        }
    }

    const publicId = await ImageResource.generatePublicId(publicIdSet);
    
    const image = new ImageResource({
      creator: req.username,
      visibility: req.body.visibility,
      image: imageBuffer,
      contentType: contentType,
      publicId
    });

    const imageDocument = await image.save()
    .catch(function(error) {
        if (error.name === 'ValidationError') {
            res.status(400).send("The template data could not be validated.");
        } else {
            res.status(500).send();
        }
    });

    templateData.images.push({
      url: await imageDocument.getImageUrl(),
      x: img.x,
      y: img.y,
      contentType: imageDocument.contentType
    });
  }
  
  templateData.publicId = await Template.generatePublicId();
  
  const template = new Template(templateData);
    
  template.save()
  .then(async function(doc) {
    res.status(201).json({...doc.toObject(), _id: undefined, __v: undefined});
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
