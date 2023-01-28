

/*
    Uses some code from https://sirmuel.design/creating-a-nodejs-meme-generator-908fccd35b01

*/
var express = require('express');
var router = express.Router();

const axios = require('axios');
const archiver = require('archiver');
const Canvas = require('canvas');
const {Meme, User, Template, generateUrl} = require('../db/models');
const mongoose = require("mongoose");

const Image = Canvas.Image;

const canvas = Canvas.createCanvas(1000, 1000);
const ctx = canvas.getContext('2d');

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
function calculateCanvasSize({resizeCanvas=true, scaleImage=false, width=1000, height=1000, images=[]}={}){
    if(resizeCanvas) {
        // Increase the size of the canvas to fit all images
        /* let minX = 3000, minY = 3000, maxX = 0, maxY = 0;
        for (const img of images) {
            minX = Math.min(minX, img.x);
            minY = Math.min(minY, img.y);
            maxX = Math.max(maxX, img.x + img.image.width);
            maxY = Math.max(maxY, img.y + img.image.height);
        }
        canvas.width = maxX - minX;
        canvas.height = maxY - minY; */
    }
    else {
        canvas.width = width;
        canvas.height = height;
    }
}

function generateMemeCanvas({config={}, data={}}={}){

    console.log("Opts", config);
    console.log("Data", data);

    return new Promise(function(resolve, reject){
        calculateCanvasSize({resizeCanvas: data.canvas?.resizeCanvas, width: data.canvas?.width, height: data.canvas?.height});
        drawMeme({texts: data.texts, loadedImages: data.loadedImages});    
        resolve(canvas.toBuffer());
    });
}

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



router.post('/', async function(req, res) {
    //const db = req.db;
    /* const users = db.get('users');
    const memes = db.get('memes'); */

    // TODO: Add to metadata whether the currently authorised user liked the meme
    console.log("Post Request", req.body);

    req.username = req.body.username; // TODO: ???

    const existingUser = await User.findOne({ username: req.username });
    if(!existingUser) {
        res.status(401).send("User does not exist: " + req.username);
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
            memeName: generateName(req.username) + " " + paddedIndex,
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
            // Load template from database
            const templateInDatabase = await Template.findOne({ name: template.name });
            if(!templateInDatabase) {
                res.status(404).send("Template could not be found: " + template.name);
                return;
            }
            data_template.texts = templateInDatabase.texts;
            data_template.url = templateInDatabase.url;
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
                const imageUrl =  `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`
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
            creator: req.username, 
            name: m.name,
            contentType: 'image/png', // TODO:
        }});

        let urlSet = new Set();
        for(const m of storeMemes) {
            m.url = 'm' + await generateUrl(Meme, urlSet);
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

router.post('/:url/like', async function(req, res, next) {
// TODO: Like the meme with the currently authorised user


});

router.get('/:url/like', async function(req, res, next) {
// TODO: Check if currently authorised user liked the meme


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
        return: 'json' // single-view, image-url, download, json
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
    switch(config.return) {
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
            // TODO: Retrieve port and address
            console.log("PORT", process.env.PORT);
            res.status(201).json({ urls: documents.map(m => `${req.protocol}://${req.get('host')}/resources/images/${m.url}`) });
            return;
    }
});
console.log(process.env.DOMAIN)
module.exports = router;