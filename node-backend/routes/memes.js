

/*
    Uses some code from https://sirmuel.design/creating-a-nodejs-meme-generator-908fccd35b01

*/
var express = require('express');
var router = express.Router();

const axios = require('axios');
const archiver = require('archiver');
const Canvas = require('canvas');
const {Meme, User, Template, Like, Comment} = require('../db/models');
const {authenticate} = require('../db/authentication');
const {handleMemeFind, handleMemesResponse} = require('../db/memeUtils');

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
    console.log("Writing text", text, x, y, fontSize, fontStyle)
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

    console.log("Texts", texts)

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
    handleMemesResponse(res, documents, 'json');
    // Example request:
    // /memes?limit=50&skip=50&sort=newest
});

router.get('/download', authenticate(false), async function(req, res, next) {
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    handleMemesResponse(res, documents, 'zip');
});

router.get('/image', authenticate(false), async function(req, res, next) {
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    handleMemesResponse(res, documents, 'image');
});

router.get('/single-view', authenticate(false), async function(req, res, next) {
    const documents = await handleMemeFind(req);
    if(typeof(documents) === 'number') { // error code returned
        return res.status(documents).send();
    }
    handleMemesResponse(res, documents, 'single-view');
});


router.post('/', authenticate(), async function(req, res) {
    // TODO: Accept base64 as images .img
    // TODO: Set content type
    // TODO: Fix generated names. It should be memeCount + 1 (no zero padding anymore)

    const username = req.username;
    if(username == undefined) return res.status(401).send();

    const existingUser = await User.findOne({ username });
    if(!existingUser) {
        res.status(401).send("User does not exist: " + username);
        return;
    }

    const config_default = {
        store: undefined,
        return: undefined // Returns a single-view url when store is defined, otherwise returns an image/zip
    };
    const config = Object.assign({}, config_default, req.body.config);

    let templates = req.body.templates ?? [{}];

    const createdMemes = [];

    if(!Array.isArray(templates) ) {
        templates = [templates];
    }

    // Generate the meme images from the provided templates, and the text objects
    for(const i in templates) {
        const template = templates[i];
        // Create nice, 0-padded names
        const paddedIndex = (i + 1).toString().padStart(templates.length.toString().length, '0');
        const data_default = {
            memeName: generateName(username) + " " + paddedIndex,
            texts: ["ONE DOES NOT SIMPLY", "USE JS FOR BACKEND PROGRAMMING"], 
            images: 'https://8ms.com/uploads/2022/08/image-3-700x412.png',
            canvas: {
                width: 1000,
                height: 1000,
                resizeCanvas: false
            }
        };
        const data_template = {};
        if(template.name) {
            console.log("Load template", template.name)
            // Load template from database
            let templateInDatabase = await Template.findOne({ name: template.name }, { image: 0, _id: 0, __v: 0 });
            if(!templateInDatabase) {
                res.status(404).send("Template could not be found: " + template.name);
                return;
            }
            templateInDatabase = templateInDatabase.toObject();
            data_template.texts = templateInDatabase.texts;
            data_template.images = [{url: templateInDatabase.url}];
        }
        const data = Object.assign(data_default, data_template, template); // TODO: Currently does not check whether memeNames collide
        if(!Array.isArray(data.images)) {
            data.images = [{url: data.images}];
        }
        
        const loadedImages = [];
        for (const img of data.images) {
            const canvas_img = new Image();
            try {
                const response = await axios.get(img.url, {responseType: 'arraybuffer'});
                const imageUrl =  `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
                canvas_img.src = imageUrl;
                loadedImages.push({
                    image: canvas_img,
                    x: img.x,
                    y: img.y
                });
            } catch (error) {
                res.status(400).send("The image could not be loaded: " + img.url);
                return;
            }
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
        createdMemes.push({img, name: data.memeName});
    }
    

    if(!config.store){ 
        // The meme should not be stored on the server
        // Always return as image or zip, as no url was created
        if(createdMemes.length === 1) {
            // Return a single image
            res.set('Content-Type', 'image/png');
            res.send(createdMemes[0].img);
            return;
        }
        else {
            // Send ZIP
            const archive = archiver('zip', { zlib: { level: 9 } });
            res.attachment('memes.zip');
            archive.pipe(res);
            for(let i = 0; i < createdMemes.length; i++) {
                const extension = 'image/png'.split('/')[1];
                archive.append(createdMemes[i].img, { name: createdMemes[i].name + "." + extension});
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
            contentType: 'image/png', // TODO:
        }});

        let publicIdSet = new Set();
        for(const m of storeMemes) {
            m.publicId = await Meme.generatePublicId(publicIdSet);
        }

        Meme.create(storeMemes)
        .then(function() {
            // Return either a download, or an url to the image, or an url to the single-view
            if(config.return === 'download') { // TODO: Duplicate code...
                if(createdMemes.length === 1) {
                    // Return a single image
                    res.set('Content-Type', 'image/png');
                    res.send(createdMemes[0]);
                    return;
                }
                else {
                    // Send ZIP
                    const archive = archiver('zip', { zlib: { level: 9 } });
                    res.attachment('memes.zip');
                    archive.pipe(res);
                    for(let i = 0; i < createdMemes.length; i++) {
                        const extension = 'image/png'.split('/')[1];
                        archive.append(createdMemes[i].img, { name: createdMemes[i].name + "." + extension});
                    }
                    archive.finalize();
                    return;
                }
                
            }
            else if( config.return === 'image-url' ) {
                // Url to the image itself
                res.status(201).json({ message: 'Memes created', urls: storeMemes.map(m => `${req.protocol}://${req.get('host')}/resources/images/${m.publicId}`) });
                return;
            }
            else { // TODO: Sending by single-view url is standard
                res.status(201).json({ message: 'Memes created', urls: storeMemes.map(m => `${req.protocol}://${req.get('host')}/memes/${m.publicId}`) });
                return;
            }
            
        })
        .catch(function(error) {
            if (error.name === 'ValidationError') {
                // handle validation error
                res.status(400).send(error); // FIXME: TODO:
            } else {
                res.status(500).send(error);
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
    // TODO: Check visibility permissions of meme

    if(username == undefined) return res.status(401).send();
    const commentId = await Comment.generatePublicId();

    const comment = new Comment({ username, memePublicId, content, publicId: commentId });
    comment.save()
    .then(function() {
        return res.status(201).json({ message: 'Comment created'});
    })
    .catch(function(error) {
        return res.status(500).send();
    });
});

router.get('/:publicId/comments', authenticate(false), async function(req, res, next) {
    // TODO: Check visibility permissions of meme
    const memePublicId = req.params.publicId;
    const comments = await Comment.find({ memePublicId }, { _id: 0, __v: 0 })
    .catch(function(error) {
        res.status(500).send();
    }); 
    res.json(comments);
});

router.get('/:publicId/comments/:commentId', authenticate(false), async function(req, res, next) {
    // TODO: Check visibility permissions of meme
    const memePublicId = req.params.publicId;
    const commentId = req.params.commentId;
    const comments = await Comment.findOne({ memePublicId, publicId: commentId }, { _id: 0, __v: 0 })
    .catch(function(error) {
        res.status(500).send();
    }); 
    res.json(comments);
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
    else return res.status(204).send(); // FIXME: Correct status code?
});


// Like the meme with the currently authenticated user
router.put('/:publicId/like', authenticate(), async function(req, res, next) {
    const username = req.username;
    const memePublicId = req.params.publicId;

    if(username == undefined) return res.status(401).send();

    const existingLike = await Like.findOne({ username, memePublicId })
    .catch(function(error) {
        return res.status(500).send();
    });

    if (existingLike) {
        return res.status(204).send("Meme was already liked by the user"); // FIXME: Correct status code?
    }

    const like = new Like({ username, memePublicId });
    like.save()
    .then(function() {
        return res.status(201).json({ message: 'Meme was liked by the user'});
    })
    .catch(function(error) {
        return res.status(500).send();
    });
});

// Unlikes the meme with the currently authenticated user
router.delete('/:publicId/like', authenticate(), async function(req, res, next) {
    const username = req.username;
    const memePublicId = req.params.publicId;
    if(username == undefined) return res.status(401).send();
    const like = await Like.findOneAndDelete({ username, memePublicId })
    .catch(function(error) {
        res.status(500).send();
    }); 
    
    if(like) return res.status(200).send();
    else return res.status(204).send(); // FIXME: Correct status code?
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

/* router.get('/:publicId', authenticate(false), async function(req, res, next) {

    const publicId  = req.params.publicId;
    Meme.findOne({ publicId }, EXCLUDE_PROPERTIES)
    .then( async doc => {
        if (!doc) {
            return res.status(404).send({ error: "Meme not found" });
        }
        if ((doc.visibility === 'private') && req.username !== doc.creator ) {
            return res.status(401).send();
        }
        return res.json({...doc.toObject(), likes: await doc.getLikesCount(), comments: await doc.getCommentsCount()});
    })
    .catch((e) => res.status(500).send());
  }); */


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

    handleMemesResponse(res, documents[0], 'json');
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

    handleMemesResponse(res, documents[0], 'image');
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

    handleMemesResponse(res, documents[0], 'zip');
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

    handleMemesResponse(res, documents[0], 'single-view');
});





module.exports = router;