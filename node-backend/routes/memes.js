"use strict";

/*
    Uses some code from https://sirmuel.design/creating-a-nodejs-meme-generator-908fccd35b01

*/
var express = require('express');
var router = express.Router();

const axios = require('axios');
const archiver = require('archiver');
const Canvas = require('canvas');
const {Meme, User, Template, Like, Dislike, Comment, View, TemplateUsage} = require('../db/models');
const {authenticate} = require('../db/authentication');
const {handleMemeFind, handleMemesResponse} = require('../db/memeUtils');
const {renameDuplicates} = require('../utils/utils');

const Image = Canvas.Image;

const canvas = Canvas.createCanvas(1000, 1000);
const ctx = canvas.getContext('2d');

const EXCLUDE_PROPERTIES = { image: 0, _id: 0, __v: 0 };

/**
 * Adds text to the canvas context.
 * Dynamically resizes the text if it is too wide to fit on the canvas.
 * @param {*} param0 
 */
function writeText({text="", x=0, y=0, fontSize=50, fontStyle="impact", strokeWidth=1, resizeText=false, textColor='white'}) {
    ctx.lineWidth = strokeWidth;
    ctx.fillStyle = textColor;

    if(resizeText){
        for (; fontSize >= 8; fontSize -=1) {
            ctx.font = "bold " + fontSize + "pt " + fontStyle;
            if (ctx.measureText(text).width < canvas.width - 10) {
                ctx.fillText(text, x, y);
                ctx.strokeText(text, x, y);
                break;
            }
        }
    }
    else {
        ctx.font = "bold " + fontSize + "pt " + fontStyle;
        ctx.fillText(text, x, y);
        ctx.strokeText(text, x, y);
    } 
}

function drawMeme({texts=[], loadedImages=[]}={}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(const img of loadedImages) {
        const x = img.x ?? 0;
        const y = img.y ?? 0;
        const width = img.image.width;
        const height = img.image.height;
        ctx.drawImage(img.image, x, y, width, height);
    }
        
    ctx.strokeStyle = 'black';
    ctx.mutterLine = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for(const i in texts) {
        // TODO: Wrap text

        let x = texts[i].x;
        let y = texts[i].y;
        // Automatically choose position if it is not given
        // TODO: Improve positioning, based on font size
        if(x == undefined) {
            x = canvas.width / 2;
        }
        if(y == undefined) {
            if(i == 0) { // Can someone tell me why === does not work here???
                y = canvas.height*0.1;
            }
            else y = canvas.height - canvas.height*0.1 - (texts[i].fontSize ?? 50);
        }

        if (typeof texts[i] === 'string') writeText({text: texts[i], x, y})
        else {
            texts[i].x = x;
            texts[i].y = y;
            writeText(texts[i]);
        }
        
    }

    /* var text1 = topText;
    //var text1 = bottomText;
    text1 = text1.toUpperCase();
    x = memeWidth / 2;
    y = 0;

    wrapText(ctx, text1, x, y, memeWidth, 1.6, false, 50);
    //writeText(text1, x, y);

    ctx.textBaseline = 'bottom';
    var text2 = bottomText;
    text2 = text2.toUpperCase();
    y = memeHeight;

    wrapText(ctx, text2, x, y, memeWidth, 1.6, true, 50); */
}

/**
 * 
 * @param {*} param0 
 */
function calculateCanvasSize({resizeCanvas=false, scaleImage=false, width=1000, height=1000, images=[]}={}){
    if(resizeCanvas) {
        // Increase the size of the canvas to fit all images
        let minX = 3000, minY = 3000, maxX = 0, maxY = 0;
        for (const img of images) {
            const x = img.x ? +img.x : 0;
            const y = img.y ? +img.y : 0;
            
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + +img.image.width);
            maxY = Math.max(maxY, y + +img.image.height);
        }
        canvas.width = maxX - minX;
        canvas.height = maxY - minY;
    }
    else {
        canvas.width = width;
        canvas.height = height;
    }
    canvas.width = Math.min(Math.max(1, canvas.width),  4096); 
    canvas.height = Math.min(Math.max(1, canvas.height),  4096); 
}

function generateMemeCanvas({config={}, data={}}={}){

    return new Promise(function(resolve, reject){
        calculateCanvasSize({resizeCanvas: data.canvas?.resizeCanvas, width: data.canvas?.width, height: data.canvas?.height, images: data.loadedImages});
        drawMeme({texts: data.texts, loadedImages: data.loadedImages});    
        resolve(canvas.toBuffer());
    });
}

function generateName(username) {
    return username.slice(-1) === 's' ? username + "\' meme" : username + "\'s meme";
}


router.get('/', authenticate(false), async function(req, res, next) {
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    handleMemesResponse(res, documents, 'json', req.username);
    // Example request:
    // /memes?limit=50&skip=50&sort=newest
});

router.get('/download', authenticate(false), async function(req, res, next) {
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    handleMemesResponse(res, documents, 'zip', req.username);
});

router.get('/image', authenticate(false), async function(req, res, next) {
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    handleMemesResponse(res, documents, 'image', req.username);
});

router.get('/single-view', authenticate(false), async function(req, res, next) {
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    handleMemesResponse(res, documents, 'single-view', req.username);
});


router.post('/', authenticate(), async function(req, res) {

    const username = req.username;
    if(username == undefined) return res.status(401).send();

    const existingUser = await User.findOne({ username });
    if(!existingUser) {
        res.status(401).send("User does not exist: " + username);
        return;
    }

    const config_default = {
        store: undefined,
        return: 'json' // Returns a single-view url when store is defined, otherwise returns an image/zip
    };
    const config = Object.assign({}, config_default, req.body.config);

    if (!['unlisted', 'private', 'public'].includes(config.store)) {
        config.store = undefined;
    }

    if (!['image', 'single-view', 'download', 'zip', 'json'].includes(config.return)) {
        config.return = 'json';
    }

    let templates = req.body.templates ?? [{}];

    const createdMemes = [];

    if(!Array.isArray(templates) ) {
        templates = [templates];
    }

    // Generate the meme images from the provided templates, and the text objects
    for(const i in templates) {
        const template = templates[i];
        const data_default = {
            memeName: generateName(username),
            texts: [], 
            images: undefined,
            canvas: {
                width: 1000,
                height: 1000,
                resizeCanvas: false
            }
        };
        const data_template = {};
        const newMeme = {};
        if(template.name) {
            // Load template from database
            let templateInDatabase = await Template.findOne({ name: template.name }, { image: 0, _id: 0, __v: 0 });
            if(!templateInDatabase) {
                res.status(404).send("Template could not be found: " + template.name);
                return;
            }
            templateInDatabase = templateInDatabase.toObject();
            data_template.texts = templateInDatabase.texts;
            data_template.images = templateInDatabase.images;
            data_template.canvas = templateInDatabase.canvas;

            newMeme.usedTemplate = templateInDatabase.publicId;
        }
        const data = Object.assign(data_default, data_template, template);
        if(data.images == undefined) continue;

        let contentType = 'image/png';
        let inferContentType = false;
        if(!Array.isArray(data.images)) {
            data.images = [{url: data.images}];
        }
        if(data.images.length === 1) inferContentType = true;
        
        const loadedImages = [];
        for (const img of data.images) {
            if(img.url == undefined) continue;
            
            const canvas_img = new Image();
            if(img.url.startsWith('data:image/')) { // image.url is base64
                canvas_img.src = img.url;
                if(inferContentType) contentType = img.url.split(';')[0].split(':')[1];
            }
            else { // image.url is an actual url
                try {
                    const response = await axios.get(img.url, {responseType: 'arraybuffer'});
                    const imageUrl =  `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
                    canvas_img.src = imageUrl;
                    if(inferContentType) contentType = response.headers['content-type'];
                } catch (error) {
                    console.error(error);
                    return res.status(400).send("The image could not be loaded: " + img.url);
                }
            }
            loadedImages.push({
                image: canvas_img,
                x: img.x,
                y: img.y
            });
            
        }
        // Wait until all images were loaded
        const promises = loadedImages
        .filter(img => !img.image.complete)
        .map(img => new Promise(resolve => {
            img.image.onload = img.image.onerror = resolve;
        }));

        await Promise.all(promises);
        data.loadedImages = loadedImages;
        const img = await generateMemeCanvas({config, data});
        newMeme.img = img;
        newMeme.name = data.memeName;
        newMeme.contentType = contentType;
        createdMemes.push(newMeme);
    }
    

    if(!config.store){ 
        // The meme should not be stored on the server
        // Always return as image or zip, as no url was created
        if(createdMemes.length === 1) {
            // Return a single image
            res.set('Content-Type', createdMemes[0].contentType);
            res.send(createdMemes[0].img);
            return;
        }
        else {
            // Send ZIP
            const archive = archiver('zip', { zlib: { level: 9 } });
            res.attachment('memes.zip');
            archive.pipe(res);
            const names = renameDuplicates(createdMemes.map(m => m.name));

            for(let i = 0; i < createdMemes.length; i++) {
                const extension = createdMemes[i].contentType.split('/')[1];
                archive.append(createdMemes[i].img, { name: names[i] + "." + extension});
            }
            archive.finalize();
            return;
        }
    }

    if(config.store) {
        // The meme should be stored on the server

        const storeMemes = createdMemes.map(m => {return {
            image: m.img, 
            visibility: config.store, 
            creator: username, 
            name: m.name,
            usedTemplate: m.usedTemplate,
            contentType: m.contentType
        }});

        let publicIdSet = new Set();
        for(const m of storeMemes) {
            m.publicId = await Meme.generatePublicId(publicIdSet);

            if(m.usedTemplate) {
                try {
                    TemplateUsage.create({
                        template: m.usedTemplate,
                        memePublicId: m.publicId
                    })
                }
                catch(error) {
                    console.error(error);
                    res.status(500).send();
                }
            }
            
        }

        Meme.create(storeMemes)
        .then(async function(documents) {
            await handleMemesResponse(res, documents, config.return, req.username);
        })
        .catch(function(error) {
            console.error(error);
            if (error.name === 'ValidationError') {
                // handle validation error
                res.status(400).send();
            } else {
                res.status(500).send();
            }
        });
    }
});

// Gets the meme associated with publicId as json, only if the user is authorized to see it


router.post('/:publicId/comments', authenticate(), async function(req, res, next) {
    const username = req.username;
    const memePublicId = req.params.publicId;
    const content = req.body.content;

    if(!content) return res.status(400).send("No content provided");
    if(username == undefined) return res.status(401).send();

    // Check visibility permissions of meme
    req.query = {
        id: req.params.publicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }
    
    const commentId = await Comment.generatePublicId();

    const comment = new Comment({ username, memePublicId, content, publicId: commentId });
    comment.save()
    .then(async function(doc) {
        return res.status(201).json({...doc.toObject(), creatorDisplayName: await doc.getCreatorDisplayName()});
    })
    .catch(function(error) {
        return res.status(500).send();
    });
});

router.get('/:publicId/comments', authenticate(false), async function(req, res, next) {
    const memePublicId = req.params.publicId;

    // Check visibility permissions of meme
    req.query = {
        id: memePublicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    const comments = await Comment.find({ memePublicId }, { _id: 0, __v: 0 })
    .catch(function(error) {
        res.status(500).send();
    }); 
    const commentsJSON = await Promise.all(comments.map(async c => ({...c.toObject(), creatorDisplayName: await c.getCreatorDisplayName()})));

    res.json(commentsJSON);
});

router.get('/:publicId/comments/:commentId', authenticate(false), async function(req, res, next) {
    const memePublicId = req.params.publicId;

    // Check visibility permissions of meme
    req.query = {
        id: memePublicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    const commentId = req.params.commentId;
    const comment = await Comment.findOne({ memePublicId, publicId: commentId }, { _id: 0, __v: 0 })
    .catch(function(error) {
        res.status(500).send();
    }); 
    if(comment) res.status(404).send();
    else res.json(comment);
});

router.delete('/:publicId/comments/:commentId', authenticate(), async function(req, res, next) {
    const username = req.username;
    const memePublicId = req.params.publicId;
    const commentId = req.params.commentId;
    if(username == undefined) return res.status(401).send();
    const comment = await Comment.findOneAndDelete({ username, memePublicId, publicId: commentId })
    .catch(function(error) {
        res.status(500).send();
    }); 
    
    if(comment) return res.status(200).send();
    else return res.status(404).send();
});

// Adds a view to the meme, only one per user
async function addView(memePublicId, username) {
    const existingView = await View.findOne({ username, memePublicId })
    .catch(function(error) {
        return;
    });

    if (existingView) {
        return;
    }

    const view = new View({ username, memePublicId });
    try {
        view.save();
    }
    catch(error) {
        console.error(error);
    }
    return;
}

// Like the meme with the currently authenticated user
router.put('/:publicId/like', authenticate(), async function(req, res, next) {
    const username = req.username;
    const memePublicId = req.params.publicId;

    if(username == undefined) return res.status(401).send();

    // Check visibility permissions of meme
    req.query = {
        id: memePublicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    await Dislike.findOneAndDelete({ username, memePublicId })
    .catch(function(error) {
        res.status(500).send();
    }); 

    const existingLike = await Like.findOne({ username, memePublicId })
    .catch(function(error) {
        return res.status(500).send();
    });

    if (existingLike) {
        return res.status(409).send("Meme was already liked by the user");
    }

    const like = new Like({ username, memePublicId });
    like.save()
    .then(function() {
        return res.status(201).send('Meme was liked by the user');
    })
    .catch(function(error) {
        return res.status(500).send();
    });
});

router.put('/:publicId/dislike', authenticate(), async function(req, res, next) {
    const username = req.username;
    const memePublicId = req.params.publicId;

    if(username == undefined) return res.status(401).send();

    // Check visibility permissions of meme
    req.query = {
        id: memePublicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    await Like.findOneAndDelete({ username, memePublicId })
    .catch(function(error) {
        res.status(500).send();
    }); 

    const existingDislike = await Dislike.findOne({ username, memePublicId })
    .catch(function(error) {
        return res.status(500).send();
    });

    if (existingDislike) {
        return res.status(409).send("Meme was already disliked by the user");
    }

    const dislike = new Dislike({ username, memePublicId });
    dislike.save()
    .then(function() {
        return res.status(201).send('Meme was disliked by the user');
    })
    .catch(function(error) {
        return res.status(500).send();
    });
});

// Un-likes the meme with the currently authenticated user
router.delete('/:publicId/like', authenticate(), async function(req, res, next) {
    const username = req.username;
    const memePublicId = req.params.publicId;
    if(username == undefined) return res.status(401).send();
    const like = await Like.findOneAndDelete({ username, memePublicId })
    .catch(function(error) {
        res.status(500).send();
    }); 
    
    if(like) return res.status(200).send();
    else return res.status(409).send();
});

router.delete('/:publicId/dislike', authenticate(), async function(req, res, next) {
    const username = req.username;
    const memePublicId = req.params.publicId;
    if(username == undefined) return res.status(401).send();
    const dislike = await Dislike.findOneAndDelete({ username, memePublicId })
    .catch(function(error) {
        res.status(500).send();
    }); 
    
    if(dislike) return res.status(200).send();
    else return res.status(409).send();
});

// Checks whether the authenticated user liked the meme
router.get('/:publicId/like', authenticate(), async function(req, res, next) {
    const username = req.username;
    const memePublicId = req.params.publicId;
    if(username == undefined) return res.status(401).send();
    const like = await Like.findOne({ username, memePublicId });
    if(like) req.send(200, {"liked": true});
    else req.send(200, {"liked": false});
});

router.get('/:publicId/dislike', authenticate(), async function(req, res, next) {
    const username = req.username;
    const memePublicId = req.params.publicId;
    if(username == undefined) return res.status(401).send();
    const dislike = await Dislike.findOne({ username, memePublicId });
    if(dislike) req.send(200, {"disliked": true});
    else req.send(200, {"disliked": false});
});

router.get('/:publicId/likes', authenticate(false), async function(req, res, next) {
    const memePublicId = req.params.publicId;

    // Check visibility permissions of meme
    req.query = {
        id: memePublicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    const likes = await Like.find({ memePublicId }, { _id: 0, __v: 0 })
    .catch(function(error) {
        res.status(500).send();
    }); 
    res.json(likes);
});

router.get('/:publicId/dislikes', authenticate(false), async function(req, res, next) {
    const memePublicId = req.params.publicId;

    // Check visibility permissions of meme
    req.query = {
        id: memePublicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    const dislikes = await Dislike.find({ memePublicId }, { _id: 0, __v: 0 })
    .catch(function(error) {
        res.status(500).send();
    }); 
    res.json(dislikes);
});

router.get('/:publicId/views', authenticate(false), async function(req, res, next) {
    const memePublicId = req.params.publicId;

    // Check visibility permissions of meme
    req.query = {
        id: memePublicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    const views = await View.find({ memePublicId }, { _id: 0, __v: 0 })
    .catch(function(error) {
        res.status(500).send();
    }); 
    res.json(views);
});

router.put('/:publicId/views', authenticate(), async function(req, res, next) {
    if(req.get('Origin') !== `http://${process.env.FE_DOMAIN}`) {
        console.log(req.get('Origin'))
        res.status(403).send();
    }
    const memePublicId = req.params.publicId;
    const username = req.username;
    addView(memePublicId, username);

    res.send();
});

router.get('/:publicId', authenticate(false), async function(req, res, next) {
    req.query = {
        id: req.params.publicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    // Add view if the user is authenticated
    if(req.username) addView(req.params.publicId, req.username);

    handleMemesResponse(res, documents[0], 'json', req.username);
});

router.get('/:publicId/image', authenticate(false), async function(req, res, next) {
    req.query = {
        id: req.params.publicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    handleMemesResponse(res, documents[0], 'image', req.username);
});

router.get('/:publicId/download', authenticate(false), async function(req, res, next) {
    req.query = {
        id: req.params.publicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    handleMemesResponse(res, documents[0], 'zip', req.username);
});

router.get('/:publicId/single-view', authenticate(false), async function(req, res, next) {
    req.query = {
        id: req.params.publicId
    };
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    if(documents.length === 0) {
        return res.status(404).send("Meme not found");
    }

    handleMemesResponse(res, documents[0], 'single-view', req.username);
});

router.delete('/:publicId', authenticate(), async function(req, res, next) {
    const username = req.username;
    const publicId  = req.params.publicId;
  
    const meme = await Meme.findOneAndDelete({ creator: username, publicId })
    .catch(function(error) {
        res.status(500).send();
    }); 
  
    if(meme) return res.status(200).send("Meme deleted");
    else return res.status(404).send("Meme not found");
  });



module.exports = router;