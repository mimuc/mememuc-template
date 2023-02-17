var express = require('express');
var router = express.Router();

// Link to gow to insert image
//https://stackoverflow.com/questions/44869479/what-data-type-should-i-use-to-store-an-image-with-mongodb


//Insert created Meme
router.post('/insert', function (req, res, next) {
    console.log("im backend");
    const db = req.db;
    if (db.get('createdMemes') === undefined) db.create("createdMemes");

    db.get('createdMemes').insert({
        creator: req.session.username,
        image: req.body.image,
        imgWidth: req.body.imgWidth,
        imgHeight: req.body.imgHeight,
        text1: req.body.text1,
        text1XPos: req.body.text1XPos,
        text1YPos: req.body.text1YPos,
        text1Bold: req.body.text1Bold,
        text1Italic: req.body.text1Italic,
        text1Color: req.body.text1Color,
        text2: req.body.text2,
        text2Bold: req.body.text2Bold,
        text2XPos: req.body.text2XPos,
        text2YPos: req.body.text2YPos,
        text2Bold: req.body.text2Bold,
        text2Italic: req.body.text2Italic,
        text2Color: req.body.text2Color,
        title: req.body.title,
        likes: 0,
    });
    res.status(200).send();
});

router.post('/insert-draft', function(req, res, next) {
    console.log("im backend");
    const db = req.db;
    if (db.get('memeDrafts') === undefined) db.create("memeDrafts");

    db.get('memeDrafts').insert({
        creator: req.session.username,
        image: req.body.image,
        imgWidth: req.body.imgWidth,
        imgHeight: req.body.imgHeight,
        text1: req.body.text1,
        text1XPos: req.body.text1XPos,
        text1YPos: req.body.text1YPos,
        text1Bold: req.body.text1Bold,
        text1Italic: req.body.text1Italic,
        text1Color: req.body.text1Color,
        text2: req.body.text2,
        text2Bold: req.body.text2Bold,
        text2XPos: req.body.text2XPos,
        text2YPos: req.body.text2YPos,
        text2Bold: req.body.text2Bold,
        text2Italic: req.body.text2Italic,
        text2Color: req.body.text2Color,
        title: req.body.title,
        likes: 0,
    });
    res.status(200).send();
});

// Get created meme
router.post('/find', function (req, res, next) {
    const db = req.db;
    const searchString = req.body.searchString;
    const hasMore = false;
    console.log("Searching for memes including: " + searchString);
    const createdMemes = db.get('createdMemes');
    createdMemes.find({})
        .then((memes) => {
            findAllElements(memes, searchString)
                .then((resultMemes) => {
                    console.log("filtered " + resultMemes.length + " memes");
                    const nextResponse = {
                        resultMemes,
                        hasMore
                    }
                    res.json(nextResponse);
                })
                .catch((e) => {
                    console.error(e);
                    res.status(500).send();
                })
        })
        .catch((e) => {
            console.error(e);
        })

});

router.post('/like', function (req, res) {
    console.log('in /like');
    const db = req.db;
    const createdMemes = db.get('createdMemes');
    createdMemes.find({ _id: req.body.uid }).then((docs) => {
        // console.log(typeof docs);
        let currLikes = docs[0].likes;
        createdMemes.update({ _id: req.body.uid }, { $set: { likes: currLikes + 1 } });
        console.log('updated likes');
        res.send('Updated likes');
    });
})

router.get('/all', function (req, res) {
    const db = req.db;
    const createdMemes = db.get('createdMemes');
    const allMemes = createdMemes.find({})
        .then((docs) => {
            //console.log(docs);
            res.json(docs);
        });
});

router.post('/next', function (req, res) {
    const db = req.db;
    const offset = req.body.page;
    const size = req.body.pageSize;
    console.log(req.body);
    console.log(offset);
    console.log(size);
    const createdMemes = db.get('createdMemes');
    const allMemes = createdMemes.find({})
        .then((docs) => {
            docs = docs.reverse();
            const nextMemes = docs.slice(offset * size, offset * size + size);
            // console.log("Low index: " + offset * size + " high index: " + (offset * size + size))
            // console.log(nextMemes.length);
            let hasMore = true;
            // console.log(nextMemes[nextMemes.length-1].title);
            if (offset * size + size >= docs.length) {
                hasMore = false;
            }
            // console.log("Has more: " + hasMore);
            const nextResponse = {
                nextMemes,
                hasMore
            }
            res.json(nextResponse);
        });
});

router.get('/mymemes', (req, res) => {
    const username = req.session.username;

    const db = req.db;
    const createdMemes = db.get('createdMemes');
    const myMemes = createdMemes.find({creator: username})
        .then((docs) => {
            docs = docs.reverse();
            res.json(docs);
        })
        .catch((e) => {
            res.status(500).send("Something went wrong: " + JSON.stringify(e));
        });
});

router.get('/mydrafts', (req, res) => {
    const username = req.session.username;

    const db = req.db;
    const createdMemes = db.get('memeDrafts');
    const myDrafts = createdMemes.find({creator: username})
        .then((docs) => {
            docs = docs.reverse();
            res.json(docs);
        })
        .catch((e) => {
            res.status(500).send("Something went wrong: " + JSON.stringify(e));
        });
});

//This function searches through all memes and returns all memes that include any words of the searchString
async function findAllElements(memeArray, searchString) {
    return new Promise((resolve, reject) => {
        try {
            let memes = [];
            memeArray.forEach(element => {
                if (element.title.includes(searchString) || element.text1.includes(searchString) || element.text2.includes(searchString)) {
                    //console.log(element);
                    memes.push(element);
                }
            });
            resolve(memes);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = router;