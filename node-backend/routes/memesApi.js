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

module.exports = router;