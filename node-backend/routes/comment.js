var express = require('express');
var router = express.Router();
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectId;



router.post('/create', function(req, res, next) {
    const db = req.db;
    const collection = db.get('comments');
    const data = req.body;
    const user = req.query.user_id;
    const post_id = req.query.post_id;
    //add a comment document
    collection.insert({ 
        post_id: new ObjectID(post_id),
        user_id: new ObjectID(user),
        text: data.text,
        n_likes: 0,
        date: data.date
    }).catch(err => {
        
        console.log(err);
        res.status(500).send('Error creating comment');
    
        


}   
);
res.status(202).send('comment created');
    
  
});

//search all of one user comments in the database 
router.get('/userid', (req, res) => {
    const db = req.db;
    const posts = db.collection('comments');
    posts.find({ user_id: new ObjectID(req.params.user_id) })
    .then(post => {
        if (!posts || !posts.length) {
            
            res.status(404).send('Post not found');
            return;
        }
        // Send the post as a response
        res.status(200).json(post);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error retrieving post');
    });
});


//search comments from a comment_id
router.get('/id', (req, res) => {
    const db = req.db;
    
    const comments = db.collection('comments');
    if (!mongoose.Types.ObjectId.isValid(req.query.comment_id)) {
        
        res.status(404).send('Invalid comment ID');
        return;
      }
    comments.findOne({ _id: req.query.comment_id })
    .then(comment => {
        if (comment.length == 0) {
            
            res.status(404).send('comment not found');
            return;
        }
        // Send the post as a response
        console.log("this is the comment u fetched"+JSON.stringify(comment))
        res.status(200).json(comment);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error retrieving comment');
    });
});


module.exports = router;