var express = require('express');
const { post } = require('./post');
var router = express.Router();

router.put('/create', function(req, res, next) {
    const db = req.db;
    const collection = db.get('users');
    const data = req.body;

    //either like or dislike
    const type = req.query.type; 
    const user = req.query.user;
    const post = req.query.post;
    const update = [];
    const filter = {_id:user};
    if (type == "like"){
    update = [
      { $addToSet: { likes: {post_id: post} } ,
       $pull: { dislikes: {post_id: post} } },
      { $set: { n_likes: { $size: "$likes" } },
       $set: {n_dislikes:{$size:"$dislikes"}}
    
    }
    ];
  }
  else if (type == "dislike"){
    const update = [
      { $addToSet: { dislikes: {post_id: post} } ,
       $pull: { likes: {post_id: post} } },
      { $set: { n_likes: { $size: "$likes" } },
       $set: {n_dislikes:{$size:"$dislikes"}}
    
    }
    ];
  }

  else {

    res.status(400).send('Error: type query params should be either like or dislike')
  }
    collection.update(filter,{ $batch: update })
    .then((result) => res.status(200).send(result))

    .catch((error)=>{
      console.log(error)
    res.status(500).send('Error creating like');}
    )

   
     
   
 
        
    
});


router.post('/delete/:like_id', function(req, res, next) {
  const db = req.db;
  const like_id = req.params.like_id;
  const post_id = req.query.post_id;
  const collection = db.get('likes');
  const data = req.body;
   
  //add a like document
  try {
    const result = collection.remove({
        _id : like_id
    });

    res.status(200).send(result);
} catch (error) {
    res.status(500).send(error);
}
  /*
  .catch(err => {
      if (err) {
          console.log(err);
          res.status(500).send('Error creating like');
          
      }*/
      
  
});


module.exports = router;