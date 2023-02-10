var express = require('express');
var router = express.Router();
const maxLoadingLimit = 1000;

/* GET meme. */
router.post('/', function(req, res, next) {
    //console.log("Before fetch");
    //console.log(req);
    fetch("https://api.imgflip.com/get_memes", {
        method:"GET"
    })
    .then((data) => {
        //console.log(data.status);
        // console.log(data.body);
        return data.json();
    }).then((json) => {
        let memeArray = json.data.memes;
        let name = req.body.name;
        //let name = "Mother Ignoring Kid Drowning In A Pool";
        for(let i = 0; i < memeArray.length; i++){
            if(memeArray[i].name == name){
                console.log(memeArray[i]);
                res.json(memeArray[i]);
                return;
            }
        }
        //console.log(memeArray);
        res.sendStatus(404);
    });
});

router.get("/all", function(req, res, next) {
    console.log("All Images");
    fetch("https://api.imgflip.com/get_memes", {
        method:"GET"
    })
    .then((data) => {
        return data.json();
    }).then((json) => {
        let memeArray = json.data.memes;
        console.log(memeArray);
        res.json(memeArray);
    });
});

router.post("/page", function(req, res, next) {
    const limit = req.body.limit;
    const offset = req.body.offset;
    const endpoint = `https://api.imgflip.com/get_memes`;
    let hasMore = true;

    fetch(endpoint, {
            method: "GET",
        }).then((data) => {
            if(!data.ok){
                throw new Error(`HTTP error, status = ${data.status}`);
            }
            return data.json();
        }).then((json) => {
            //console.log("DATA: ", json);
            let memeArray = json.data.memes;
            let resultMemes = [];
            for(let i=offset; i<(offset+limit); i++) {
                if(i<memeArray.length) {
                    //console.log("Pushing to results...");
                    resultMemes.push(memeArray[i]);
                }
            }
            if(resultMemes.length < limit) {
                hasMore = false;
            } 
            console.log(resultMemes);
            res.json({resultMemes, hasMore});
        }).catch((error) => {
            console.log("error = ", error);
        });
  });

router.post("/find", function(req, res, next) {
    const searchString = req.body.searchString;
    const hasMore = false;
    const endpoint = `https://api.imgflip.com/get_memes`;
    console.log("Searching for templates including: " + searchString);

    fetch(endpoint, {
        method: "GET",
    }).then((data) => {
        if(data.ok){
            return data.json();
        }else{
            throw new Error(`HTTP error, status = ${data.status}`);
        }
    })
    .then((json) => {
        findAllElements(json.data.memes, searchString)
            .then((resultMemes) => {
                console.log("filtered " + resultMemes.length + " memes")
                const nextResponse = {
                    resultMemes,
                    hasMore
                }
                res.json(nextResponse);
            })
            .catch((e) => {
                console.log(e)
                res.status(500).send();
            })
    })
    .catch((e) => {
        console.error(e);
        res.status(500).send();
    })
})

//This function searches through all memes and returns all memes that include any words of the searchString
async function findAllElements(memeArray, searchString) {
    return new Promise((resolve, reject) => {
        try {
            let memes = [];
            const length = ((memeArray.length > maxLoadingLimit) ? maxLoadingLimit : memeArray.length);
            console.log(memeArray);
            for(let i=0; i<length; i++) {
                if(memeArray[i].name.includes(searchString)) {
                    //console.log(memeArray[i]);
                    memes.push(memeArray[i]);
                }
            }
            resolve(memes);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = router;