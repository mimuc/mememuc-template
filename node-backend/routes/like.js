var express = require('express');
const { post } = require('./post');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;


router.put('/create', function(req, res, next) {
    const db = req.db;
    const collection = db.get('users');
    const collection2 = db.get('posts')
    const data = req.body;
    console.log(`like will be created with user ${req.query.user_id} type ${req.query.genre} and post ${req.query.post_id}`);
    //either like or dislike
    const type = req.query.genre; 
    const user = req.query.user_id;
    const post = req.query.post_id;
    if (user === undefined || post === undefined || type === undefined){
      res.status(500).send("Error: undefined post or user");
    }
    var update = [];
    const filter = {_id: user};
    if (type == "like"){
    update = 
      { $addToSet: { likes: {post_id: post} } ,
       $pull: { dislikes: {post_id: post} },
       $set: { n_likes: { $size: "$likes" } ,n_dislikes:{$size:"$dislikes"} }
    
    }
    ;
  }
  else if (type == "dislike"){
     update = 
      { $addToSet: { dislikes: {post_id: post} } ,
       $pull: { likes: {post_id: post} } ,
       $set: { n_likes: { $size: "$likes" }, n_dislikes:{$size:"$dislikes"}}
    
    }
    ;
  }

  else {

    res.status(400).send('Error: type query params should be either like or dislike')
  }


  const filterpost = {_id:post};
  var updatepost ={};
  if (type == "like"){
    updatepost = 
      { $addToSet: { likes: {user_id: user} } ,
       $pull: { dislikes: {user_id: user} } ,
      // $set: { n_likes: { $size: "$likes" } ,n_dislikes:{$size:"$dislikes"} }
    
    }
    ;
  }
  else if (type == "dislike"){
     updatepost = 
      { $addToSet: { dislikes: {user_id: user} } ,
       $pull: { likes: {user_id: user} } ,
      //  $set: { n_likes: { $size: "$likes" }, n_dislikes:{$size:"$dislikes"}}
  };
}

    collection2.update(filterpost,updatepost )
    .catch((error)=>{
      console.log(error)
    res.status(500).send('Error creating like');}
    )

    collection.update(filter,update )
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