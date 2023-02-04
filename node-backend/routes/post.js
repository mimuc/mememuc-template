const ObjectId = require('mongodb').ObjectId;
var express = require('express');
var router = express.Router();

// get a post by id 
router.get('/:post_id', (req, res) => {
    const db = req.db;
    const posts = db.collection('posts');
    posts.findOne({ _id: ObjectId(req.params.post_id) })
    .then(post => {
        if (!post) {
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


    //using to refresh the 40 most recent posts
    router.get('/get_40', (req, res) => {
        const db = req.db;
        const posts = db.collection('posts');
        posts.find({}).skip(0).limit(40).toArray()
        .then(result => {
            
            res.status(202).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error retrieving posts');
        });
        
    });

// create a post
    router.post('/create', function(req, res, next) {
        const db = req.db;
        const collection = db.get('posts');
        const data = req.body;
    
        //add a document
        collection.insert({ 
            
            
            user_id:data.user_id,
            n_likes: 0,
            date:data.date,
            comments:data.comments,
            likes:0
        })
        
        .catch (err => {
           
            console.log(err);
            res.status(500).send('Error inserting post');
           
    });
    res.status(200).send('post created');
    });



/* GET all the posts that the user created */
router.get('/gethistory/:user_id', (req, res) => {
    const db = req.db;
    const images = db.collection('posts');

    images.findOne({ _id: ObjectId(req.params.user_id) }).then (post => {
        
        if (!post) {
            res.status(404).send('Image not found');
            return;
        }

        res.status(202).json(post);


        }).catch(err =>{
            console.log(err);
            res.status(500).send('Error getting history');

        });
});




module.exports = router;
        
        
        
         