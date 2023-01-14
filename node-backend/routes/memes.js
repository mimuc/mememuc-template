

/*
    Uses some code from https://sirmuel.design/creating-a-nodejs-meme-generator-908fccd35b01

*/
var express = require('express');
var router = express.Router();

const axios = require('axios');

const Canvas = require('canvas');
const Image = Canvas.Image;

const canvas = Canvas.createCanvas(1000, 1000);
const ctx = canvas.getContext('2d');
const canvasImg = new Image();

const {Meme, User} = require('../db/models');

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

function drawMeme({texts=[]}={}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(canvasImg, 0, 0, canvasImg.width, canvasImg.height);
        
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
                y = 0;
            }
            else y = canvas.height - canvas.height*0.1;
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
function calculateCanvasSize({resizeCanvas=true, scaleImage=false}={}){
    if(resizeCanvas) {
        // Increase the size of the canvas to fit the image
        canvas.width = canvasImg.width;
        canvas.height = canvasImg.height;
    }
    else {

        // Resize the image so that if fits on the canvas
        if(canvasImg.width > canvasImg.height){
            if(canvasImg.width > canvas.width) {
                // TODO: scale down image
            }
            else if(scaleImage) {
                // TODO: scale up image
            }
        }
        else {

        }
    }
    console.log(canvasImg.width, canvasImg.height);
    if(canvasImg.width > canvasImg.height){
        canvas.height = canvasImg.height / canvasImg.width * canvas.width;
        memeWidth = canvas.width;
        memeHeight = canvas.height;
        console.log(canvas.width, canvas.height);
    }
}

function generateMemeCanvas({config={}, texts=[]}={}){

    console.log("Opts", config);
    console.log("Texts", texts);

    return new Promise(function(resolve, reject){

        // Load from image url
        if(config.imageURL) {
            axios.get(config.imageURL)
            .then(function (response) { 
                
                canvasImg.onload = function() {
                    calculateCanvasSize();
                    drawMeme({texts});    
                    resolve(canvas.toBuffer());
                }
                canvasImg.src = config.imageURL;
                
            }).catch(function (error) {
                console.log(error)
                reject(new Error('The image could not be loaded.'));
            });
        }
        
    });
};

async function test() {
    const texts = [ [ "Top Text"]];
    const config = {};

    const createdMemes = [];

    if(Array.isArray(texts) ) {
        for(const text of texts) {
            if(!Array.isArray(text) ) continue; // TODO: Maybe a better handling could be done here.
            await generateMemeCanvas({config, texts: text});
            console.log("Finished creation")
            createdMemes.push(canvas.toDataURL());
        }
    }

    if(createdMemes.length === 1) {
        // TODO: Return as image, image URL, or SingleView URL
        console.log("Finished Creating")
        console.log(createdMemes);
        
    }
    
}

function generateName(username) {
    return username.slice(-1) === 's' ? username + "\' meme" : username + "\'s meme";
}

router.post('/', async function(req, res) {
    const db = req.db;
    /* const users = db.get('users');
    const memes = db.get('memes'); */
    console.log("Post Request", req.body);

    req.username = req.body.username; // TODO: ???

    const existingUser = await User.findOne({ username: req.username });
    if(!existingUser) {
        res.status(401).send();
        return;
    }

    const config_default = {
        imageURL: 'https://8ms.com/uploads/2022/08/image-3-700x412.png',
        store: undefined,
        name: generateName(req.username)
    };
    const config = Object.assign({}, config_default, req.body.config);

    // TODO: Throw error if parameters are missing

    // TODO: Parse template as name, URL, or file. Throw error if template does not exist


    const texts = req.body.texts ?? [[]];

    console.log("Texts", texts)
    const createdMemes = [];

    if(Array.isArray(texts) ) {
        for(const text of texts) {
            console.log("Current text", text)
            if(!Array.isArray(text) ) continue; // TODO: Maybe a better handling could be done here.
            await generateMemeCanvas({config, texts: text});
            console.log("Finished creation")
            createdMemes.push(canvas.toDataURL());
        }
    }
    else{
        // TODO: Better error handling
        res.status(400).send();
    }
    if(!config.store){
        if(createdMemes.length === 1) {
            // TODO: Return as image, image URL, or SingleView URL
            console.log("Finished Creating")
            console.log(createdMemes);
            res.set('Content-Type', 'image/png');
            res.send(createdMemes);
        }
        else {
            // TODO: Send ZIP
            res.status(500).send(error);
        }
    }

    // TODO: Use next() ?

    if(config.store) {
        const storeMemes = createdMemes.map(image => {return {image, visibility: config.store, creator: req.username, name: config.name }})
        Meme.create(storeMemes)
        .then(function() {
            res.status(201).json({ message: 'Memes created' });
        })
        .catch(function(error) {
            if (error.name === 'ValidationError') {
                // handle validation error
                res.status(400).send(error);
            } else {
                res.status(500).send(error);
            }
        });
    }
});

router.get('/:memeId', async function(req, res, next) {
    // TODO: Check for privileges, whether unlisted/private should be shown

    const _id  = req.params.memeId;
    Meme.findOne({ _id })
    .then((docs) => res.json(docs))
    .catch((e) => res.status(500).send());
  });

router.get('/', async function(req, res, next) {
    // TODO: Check for privileges, whether unlisted/private should be shown

    // TODO: Implement offset.
    // /memes?limit=50&offset=50&sort=newest

    const config_default = {
        sort: 'random',
        id: undefined,
        limit: 10,
        creator: undefined
    };
    const config = Object.assign({}, config_default, req.query);
    config.limit = +config.limit;

    if(config.id) { // Returns a single meme by id in an array
        Meme.find({ _id: config.id })
        .then((docs) => res.json(docs))
        .catch((e) => res.status(500).send());
        return;
    }

    switch(config.sort){
        case 'all':
            // TODO: DEBUG
            Meme.find({})
            .select('-image')
            .then((docs) => res.json(docs))
            .catch((e) => res.status(500).send())
            return;
        case 'random': {

            const pipeline = config.creator ? [
                {
                    $match: { creator: config.creator } // Match by creator if it exists
                },
                {
                    $sample: { size: config.limit }
                }
            ] : [
                {
                    $sample: { size: config.limit }
                }
            ];

            Meme.aggregate(pipeline)
            .then((docs) => res.json(docs))
            .catch((e) => res.status(500).send(e))
            return;
        }   
        case 'newest': // Same as oldest but with different sortOrder
        case 'oldest': {
            const sortOrder = config.sort === 'newest' ? -1 : 1;
            const pipeline = config.creator ? [
                {
                    $match: { creator: config.creator } // Match by creator if it exists
                },
                {
                    $sort: { createdAt: sortOrder }
                },
                {
                    $limit: config.limit
                }
            ] : [
                {
                    $sort: { createdAt: sortOrder }
                },
                {
                    $limit: config.limit
                }
            ];

            Meme.aggregate(pipeline)
            .then((docs) => res.json(docs))
            .catch((e) => res.status(500).send(e))
            return;
        }
        default:
            res.status(400).send(e);
            return;
    }
});

module.exports = router;