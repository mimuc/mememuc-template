var express = require('express');
var router = express.Router();
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;




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
router.get('/:user_id', (req, res) => {
    const db = req.db;
    const posts = db.collection('comments');
    posts.find({ user_id: req.params.user_id }).toArray()
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


//search comments from a post_id
router.get('/:comment_id', (req, res) => {
    const db = req.db;
    const posts = db.collection('comments');
    posts.find({ user_id: req.params.comment_id }).toArray()
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


module.exports = router;