var express = require('express');
var router = express.Router();

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
    console.log("Backend: get new memePage");
    //console.log(req.body);
    console.log(offset);
  
    fetch(endpoint, {
      method: "GET",
    })
      .then(data => {
        return data.json();
      })
      .then(json => {
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
      });
  });

module.exports = router;