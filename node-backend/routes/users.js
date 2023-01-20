var express = require('express');
var router = express.Router();
const { createHash } = require('crypto');

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

//Insert new User
router.post('/insert', function(req, res, next) {
    console.log('trying to insert:');
    console.log(req.body);
    console.log(req.body.username);

    if(!req.body.username || !req.body.timestamp || !req.body.password || !req.body.email) {
        res.statusCode = 400;
        res.send('Data missing');
        return;
    }

    const db = req.db;
    if(db.get('users') === undefined) db.create("users");

    db.get('users').find({$or: [{username: req.body.username}, {email: req.body.email}]}).then((docs) => {
       if (docs.length > 0) {
           res.statusCode = 400;
           res.send()
           return;
       }
        db.get('users').insert({
            username: req.body.username,
            timestamp: req.body.timestamp,
            password: hash(req.body.password),
            email: req.body.email
        });
        res.status(200).send();
    });
});

router.get('/loggedin', function(req, res) {
    if (req.session.loggedin) {
        res.statusCode = 200;
        res.send();
    } else {
        res.statusCode = 401;
        res.send();
    }
})

router.post('/auth', function(req, res) {
    const db = req.db;
    const req_email = req.body.email;
    const req_password = req.body.password;
    console.log('In auth');
    //console.log(req);
    if(req_email && req_password) {
        console.log('email and password submitted')
       db.get('users').find({ email: req_email }).then((docs) => {
           if(docs.length > 0) {
               //res.send('Correct username');
               if(docs[0].password === hash(req_password)) {
                   res.send('Logged in');
                   req.session.loggedin = true;
                   req.session.username = docs[0].username;
                   console.log('Login complete');
               }
               else {
                   console.log("Password didn't match");
                   res.send('Wrong password');
                   res.statusCode = 401;
                   res.end();
               }
           }
           else {
               console.log("Incorrect mail");
               res.statusCode = 401;
               res.send('Incorrect email');
           }
       })
    } else {
        console.log("No credentials");
        res.statusCode = 401;
        res.send('Plese log in');
        res.end();
    }
});

/* GET user by name */
router.post('/find', function(req, res, next) {
    console.log("finding user");
      const db = req.db;
      const users = db.get('users');
      console.log("loaded from db");
      console.log(users);
      users.find({username: req.body.username}) // return all user properties, except the basic auth token
      .then((docs) => {
        console.log("preparing json..");
        console.log(docs);
        res.json(docs);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
});

module.exports = router;
