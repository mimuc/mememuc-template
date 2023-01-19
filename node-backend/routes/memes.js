

/*
    Uses some code from https://sirmuel.design/creating-a-nodejs-meme-generator-908fccd35b01

*/
var express = require('express');
var router = express.Router();

const axios = require('axios');
const archiver = require('archiver');

const Canvas = require('canvas');
const Image = Canvas.Image;

const canvas = Canvas.createCanvas(1000, 1000);
const ctx = canvas.getContext('2d');
const canvasImg = new Image();

const {Meme, User} = require('../db/models');

const mongoose = require("mongoose");

const resourcePath = '/resources/images/';

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

async function test() { // TODO: Debug function
    const texts = [ [ "Top Text"]];
    const config = {
        imageURL: 'https://8ms.com/uploads/2022/08/image-3-700x412.png',
        store: undefined,
        name: "B"
    };

    const createdMemes = [];

    if(Array.isArray(texts) ) {
        for(const text of texts) {
            console.log("Text", text)
            if(!Array.isArray(text) ) continue;
            const img = await generateMemeCanvas({config, texts: text});
            console.log("Finished creation", img)
            createdMemes.push(img);
        }
    }

    if(createdMemes.length === 1) {
        console.log("Finished Creating")
        console.log(createdMemes);
        
    }
    
}

function generateName(username) {
    return username.slice(-1) === 's' ? username + "\' meme" : username + "\'s meme";
}

function uniqueId() {
    return Date.now() + '' + Math.floor(Math.random() * 100000);
}

async function generateUrl(model, urlSet) {

    let url = uniqueId();
    let document = await model.findOne({ url });
    
    while(document || (urlSet ? urlSet.has(url) : false)) { // Ensure that the url is unique
        url = uniqueId();
        document = await model.findOne({ url });
    }
    urlSet.add(url);
    return url;
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
        name: generateName(req.username), // TODO: This makes no sense if multiple memes are generated.
        returnType: undefined // Returns a single-view url when store is defined, otherwise returns an image/zip
    };
    const config = Object.assign({}, config_default, req.body.config);

    // TODO: Throw error if parameters are missing

    // TODO: Parse template as name, URL, or file. Throw error if template does not exist

    // TODO: Support template url, rather than an imageURL


    const texts = req.body.texts ?? [[]];

    const createdMemes = [];

    // Generate the meme images from the provided images, and the text objects
    if(Array.isArray(texts) ) {
        for(const text of texts) {
            console.log("Current text", text)
            if(!Array.isArray(text) ) continue; // TODO: Maybe a better handling could be done here.
            const img = await generateMemeCanvas({config, texts: text});
            createdMemes.push(img);
        }
    }
    else{
        // TODO: Better error handling
        res.status(400).send();
        return;
    }

    if(!config.store){ 
        // The meme should not be stored on the server
        // Always return as image or zip, as no url was created
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
                // Create nice, 0-padded names
                const paddedIndex = (i + 1).toString().padStart(createdMemes.length.toString().length, '0');
                const extension = 'image/png'.split('/')[1];
                console.log("EXTENSION", extension);
                const name = `meme_${paddedIndex}.${extension}`;
                archive.append(createdMemes[i], { name });// TODO: Check for name
            }
            archive.finalize();
            return;
        }
    }

    if(config.store) {
        // The meme should be stored on the server

        const storeMemes = createdMemes.map(image => {return {
            image, 
            visibility: config.store, 
            creator: req.username, 
            name: config.name,
            contentType: 'image/png', // TODO:
        }});

        let urlSet = new Set();
        for(const m of storeMemes) {
            m.url = 'm' + await generateUrl(Meme, urlSet);
        }

        Meme.create(storeMemes)
        .then(function() {
            // Return either a download, or an url to the image, or an url to the single-view
            if(config.returnType === 'download') { // TODO: Duplicate code...
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
                        // Create nice, 0-padded names
                        const paddedIndex = (i + 1).toString().padStart(createdMemes.length.toString().length, '0');
                        const extension = 'image/png'.split('/')[1];
                        console.log("EXTENSION", extension);
                        const name = `meme_${paddedIndex}.${extension}`;
                        archive.append(createdMemes[i], { name });// TODO: Check for name
                    }
                    archive.finalize();
                    return;
                }
                
            }
            else if( config.returnType === 'image-url' ) {
                // Url to the image itself
                res.status(201).json({ message: 'Memes created', urls: storeMemes.map(m => `${req.protocol}://${req.get('host')}/resources/images/${m.url}`) });
                return;
            }
            else { // TODO: Sending by single-view url is standard
                res.status(201).json({ message: 'Memes created', urls: storeMemes.map(m => `${req.protocol}://${req.get('host')}/memes/${m.url}`) });
                return;
            }
            
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

router.get('/:url', async function(req, res, next) {
    // TODO: Check for privileges, whether unlisted/private should be shown

    const url  = req.params.url;
    Meme.findOne({ url })
    .then((docs) => res.json(docs))
    .catch((e) => res.status(500).send());
  });

router.get('/', async function(req, res, next) {
    // TODO: Check for privileges, whether unlisted/private should be shown
    // TODO: Take out error sends

    // Example request:
    // /memes?limit=50&skip=50&sort=newest

    const config_default = {
        sort: 'random',
        id: undefined,
        limit: 10,
        creator: undefined,
        skip: 0,
        returnType: 'json' // single-view, image-url, download, json
    };
    const config = Object.assign({}, config_default, req.query);
    config.limit = +config.limit;
    config.skip = +config.skip;

    // The found memes
    let documents;

    if(config.id) {
        // ID was given. The meme with the id is return inside an array.
        documents = await Meme.find({ _id: config.id });
    }
    else {
        // Search for the memes, according to the config options
        switch(config.sort){
            case 'all':
                // TODO: Debug function
                documents = await Meme.find({})
                .select('-image');
                break;
            case 'random': {

                const pipeline = [
                    {
                        $sample: { size: config.limit }
                    }
                ];

                // Restrict to creator parameter
                if(config.creator) pipeline.push({$match: { creator: config.creator }});

                documents = await Meme.aggregate(pipeline);
                break;
            }   
            case 'newest': // Same as oldest but with different sortOrder
            case 'oldest': {
                const sortOrder = config.sort === 'newest' ? -1 : 1;
                const pipeline = [
                    {
                        $sort: { createdAt: sortOrder }
                    },
                    {
                        $limit: config.limit
                    },
                    {
                        $skip: config.skip
                    }
                ];

                // Restrict to creator parameter
                if(config.creator) pipeline.push({$match: { creator: config.creator }})

                documents = await Meme.aggregate(pipeline);
                break;
            }
            default:
                res.status(400).send();
                return;
        }
    }

    // Document was no found
    if(!documents) {
        res.status(404).send();
        return;
    }

    // Return the found memes
    switch(config.returnType) {
        case 'json':
            res.json(documents);
            return;
        case 'download':
            if(documents.length === 1) {
                // Return a single image
                // TODO: Add metadata
                res.set('Content-Type', 'image/png');
                res.send(documents[0].image);
            }
            else {
                // Send ZIP
                // TODO: Add metadata
                const archive = archiver('zip', { zlib: { level: 9 } });
                res.attachment('memes.zip');
                archive.pipe(res);
                for(let i = 0; i < documents.length; i++) {
                    // Create nice, 0-padded names
                    const paddedIndex = (i + 1).toString().padStart(documents.length.toString().length, '0');
                    const extension = documents[i].contentType.split('/')[1];
                    const name = `meme_${documents[i].name}_${paddedIndex}.${extension}`;
                    archive.append(documents[i].image, { name });
                }
                archive.finalize();
            }
            return;
        case 'image-url':
            // Url to the image itself
            res.status(201).json({ urls: documents.map(m => `${req.protocol}://${req.get('host')}/resources/images/${m.url}`) });
            return;
        case 'single-view':
            // TODO: Implement
            res.status(201).json({ urls: documents.map(m => `${req.protocol}://${req.get('host')}/resources/images/${m.url}`) });
            return;
    }
});

module.exports = router;