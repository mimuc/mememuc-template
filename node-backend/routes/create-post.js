var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/create_post', function(req, res, next) {
    const db = req.db;
    const collection = db.get('posts');
    const data = req.body;

    //add a document
    collection.insert({ 
        
        
        user_id:data.user_id,
        n_likes: 0,
        date:data.date,
        comments:data.comments,
        likes:0,
        


    });

    
  
});



module.exports = router;