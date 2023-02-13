var express = require('express');
const { post } = require('./post');
var router = express.Router();

router.put('/create', function(req, res, next) {
    const db = req.db;
    const collection = db.get('users');
    const data = req.body;
    const user = req.query.user;
    const post = req.query.post;
    const genre = req.query.genre;
    const filter = {_id:user};
    if ( genre == "like"){
      update = [
        { $addToSet: { likes: {post_id: post} } ,
         $pull: { dislikes: {post_id: post} } },
         {$set: { n_likes: { $size: "$likes" } },
         $set: { n_dislikes: { $size: "$dislikes" } }  }
      ];
    }else if ( genre == "dislike"){
      update = [
        { $addToSet: { dislikes: {post_id: post} } ,
         $pull: { likes: {post_id: post} } },
         {$set: { n_likes: { $size: "$likes" } },
         $set: { n_dislikes: { $size: "$dislikes" } }  }
      ];

    }
    collection.update(filter,update)
    .then((result) => res.status(200).send(result))

    .catch((error)=>{
      console.log(error)
    res.status(500).send('Error creating like');}
    )
     
   
 
        
    
});





module.exports = router;