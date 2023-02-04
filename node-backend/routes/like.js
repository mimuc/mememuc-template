var express = require('express');
const { post } = require('./post');
var router = express.Router();

router.post('/create', function(req, res, next) {
    const db = req.db;
    const collection = db.get('likes');
    const data = req.body;
     var insertedobject = { 
        
        post_id: data.post_id,
        user_id: data.user_id,
        date: data.date,
        genre: "like"
    
    
    
        }
    //add a like document
    collection.insert(insertedobject, function(error,result) {
        
        console.log(`${result}`);
        var like_created_id=insertedobject._id;
        console.log(`res.like_created_id: ${like_created_id}`);
        res.redirect(307,`/like/act/${data.post_id}?insertedId=${like_created_id}` );
        
        if (error) {
            console.log(error);
            res.status(500).send('Error creating like');
        }
    })
    /*
    .catch(err => {
        if (err) {
            console.log(err);
            res.status(500).send('Error creating like');
            
        }*/
        
    
});




    
 

//updating the like counter of the post
    
router.post('/act/:id_post', (req, res, next) => {
    var like_created_id = req.query.insertedId;
    console.log(`${like_created_id}`);
  const action = req.body.genre;
  const db = req.db;
  const counter = action === 'like' ? 1 : 0;
  if (counter== 1){
  const Post = db.collection('posts');
  Post.update({_id: req.params.id_post}, {$inc: {n_likes: counter}}, {$push: {likes: {like_id:like_created_id} }}).then(result => {
    res.status(200).send('post like counter increased');
  }).catch(error =>{
    console.error(err);
    res.status(500).send('Error updating post');
  });
    }

  const counter2 = action === 'dislike' ? 1 : 0;
  if (counter2 == 1){
  Post.update({_id: req.params.id_post}, {$inc: {n_dislikes: counter2}}, {$push: {dislikes: {dislike_id : like_created_id} }}).then(result => {
    res.status(200).send('post dislike counter increased');;
  }).catch(err =>{
    console.error(err);
    res.status(500).send('Error updating post');
  });
    }
 });


module.exports = router;