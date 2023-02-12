var express = require('express');
const { post } = require('./post');
var router = express.Router();

router.put('/create', function(req, res, next) {
    const db = req.db;
    const collection = db.get('users');
    const data = req.body;
    const user = req.query.user;
    const post = req.query.post;
    const filter = {_id:user};
    const update = {
      $addToSet: { likes: {post_id:post} },
      $pull: { dislikes: {post_id:post} }
    }
    collection.update(filter,update)
    .then((result) => res.status(200).send(result))

    .catch((error)=>{
      console.log(error)
    res.status(500).send('Error creating like');}
    )
     
   
 
        
    
});





module.exports = router;