const ObjectId = require('mongodb').ObjectId;
var express = require('express');
var router = express.Router();


router.get('/post/:post_id', (req, res) => {
    const posts = db.collection('posts');
    posts.findOne({ _id: ObjectId(req.params.post_id) })
    .then(post => {
        if (!post) {
            res.status(404).send('Post not found');
            return;
        }
        // Send the post as a response
        res.json(post);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error retrieving post');
    });
});


    //using to refresh the 40 most recent posts
    router.get('/post/get_40', (req, res) => {
        const posts = db.collection('posts');
        posts.find({}).skip(0).limit(40).toArray()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error retrieving posts');
        });
    });


module.exports = router;
        
        
        
         