const ObjectID = require('mongodb').ObjectId;
var express = require('express');
var router = express.Router();

 function getImage (db,image_id)  {
    const meme = db.collection('meme');
    
    return meme.find({_id: new ObjectID(image_id)})
    .then(
        
        result => {
           //console.log("result: "+JSON.stringify(result));
            return JSON.stringify(result);
        }
    )
    .catch((error)=> {
        console.log(error);
        return error
    });

}

//using to refresh the 40 most recent posts
router.get('/get40', (req, res) => {
    
    const db = req.db;
    const counter = req.query.counter;
    const posts = db.collection('posts');
    posts.find({ view: "normal" }, { skip: parseInt(counter), limit: 20 })
    .then(async result => {
      // go find the right meme data in the meme collection
     
      let updatedResult;
      if(result.length > 0){
      updatedResult = await Promise.all(result.map(async item => {
        
        const mymeme = await getImage(db, item.meme_id);
        const myimage = JSON.parse(mymeme)[0].image
        //console.log("in the get/40"+myimage);
        return { ...item, image: myimage };
        
      }))
    }else{
        
        return {};
    }
      

      res.status(202).json(updatedResult);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
    
});    



/* GET all the posts that the user created */
router.get('/gethistory', (req, res) => {
    const db = req.db;
    const images = db.collection('posts');
    const user_id = req.query.userId;
    console.log("user id is ");
    images.find({ user_id:user_id }).then (post => {
        
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

// get a post by id 
router.get('/:post_id', (req, res) => {
    const db = req.db;
    const posts = db.collection('posts');
    
    posts.findOne({ _id: new ObjectID(req.params.post_id) })
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
            likes:[{}]
        })
        
        .catch (err => {
           
            console.log(err);
            res.status(500).send('Error inserting post');
           
    });
    res.status(200).send('post created');
    });





/*
async function performRedirects(comments) {
    const redirects = comments.map((id) => {
      return new Promise((resolve, reject) => {
        res.redirect(307, `/comment/${id}`, () => {
          resolve();
        });
      });
    });
  
    await Promise.all(redirects);
  }*/

// get comments from a post id using a counter 

router.get('/getcomments', (req, res) => {
    const db = req.db;
    const images = db.collection('posts');
    const commentsid = [];
    const comments =[];
    
    const counter = req.query.counter;
    images.find({ _id: new ObjectID(req.query.post_id) }, { comments: { $slice: [counter, -1] } }).then (post => {
        
        if (!post) {
            res.status(404).send('Image not found');
            return;
        }
        commentsid.append(...post.comments)
        
        let results = [];
        comments.forEach((id) => {
        fetch(`/comment/${id}`)
        .then(res => res.json())
        .then(data => {
            results.push(data);
        });
});


        }).catch(err =>{
            console.log(err);
            res.status(500).send('Error getting history');

        });
});



module.exports = router;
        
        
        
         