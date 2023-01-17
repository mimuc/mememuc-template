router.post('/insert', function(req, res, next) {
    console.log(req.body);
    const db = req.db;
    if(db.get('users') === undefined) db.create("users");

    db.get('users').insert({
        username: req.body.username,
        timestamp: req.body.timestamp,
        password: hash(req.body.password),
        email: req.body.email
    });
    res.status(200).send();
});