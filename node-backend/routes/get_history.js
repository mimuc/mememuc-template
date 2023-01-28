var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;

/* GET a single post using id in parameter */
router.get('/history/:user_id', (req, res) => {
        const db = client.db(dbName);
        const images = db.collection('posts');

        images.findOne({ _id: ObjectId(req.params.user_id) }, (err, image) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error retrieving image');
                return;
            }
            if (!image) {
                res.status(404).send('Image not found');
                return;
            }

            res.json(post);

            });
    });