var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/create_comment', function(req, res, next) {
    const db = req.db;
    const collection = db.get('comments');
    const data = req.body;

    //add a like document
    collection.insert({ 
        post_id:  data.post_id,
        user_id: data.user_id,
        text: data.text,
        n_likes: data.n_likes,
        date: data.date
    },(err, image) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving image');
            return;
        }
        if (!image) {
            res.status(404).send('Image not found');
            return;
        }

});

    
  
});

//updating the like counter of the post
    
router.post('/posts_comments/:id/act', (req, res, next) => {
  
 });

module.exports = router;