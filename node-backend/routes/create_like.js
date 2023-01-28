var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/create_like', function(req, res, next) {
    const db = req.db;
    const collection = db.get('likes');
    const data = req.body;

    //add a like document
    collection.insert({ 
        
    post_id: data.post_id,
    user_id: data.user_id,
    date: data.date,
    genre: "like"



    }, (err, image) => {
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
    
router.post('/posts_like/:id/act', (req, res, next) => {
  const action = req.body.genre;
  const counter = action === 'like' ? 1 : 0;
  Post.update({_id: req.params.id}, {$inc: {n_likes: counter}}, {}, (err, numberAffected) => {
      res.send('');
  });

  const counter2 = action === 'dislike' ? 1 : 0;
  Post.update({_id: req.params.id}, {$inc: {n_dislikes: counter2}}, {}, (err, numberAffected) => {
      res.send('');
  });
 });

module.exports = router;