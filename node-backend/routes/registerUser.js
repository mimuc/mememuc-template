var express = require('express');
var router = express.Router();


router.post('/', function(req, res, next) {
    const db = req.db;
    console.log(db);
    console.log(db.users);
    if(db.users === undefined) db.create("users");

    db.get('users').insert({
        user_name: "Müller",
        time_stamp: "13.03.22 13:55",
        password: "test",
        email: "müller@gmail.com"
    });
    res.status(200).send();
  });



module.exports = router;
