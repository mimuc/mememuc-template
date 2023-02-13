var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
const MONGODB_PORT = process.env.DBPORT || '27017';

const db = require('monk')(`127.0.0.1:${MONGODB_PORT}/omm-2223`);// connect to database omm-2021
db.then(() => {
  console.log('Successfully connected to the database omm-2223');
  db.listCollections().then(collections => {
    console.log('Collections in the database omm-2223:');
    collections.forEach(collection => {
      console.log(collection.name);
    });
  });
}).catch(error => {
  console.error('Error connecting to the database: ', error);
});

console.log(`Connected to MongoDB at port ${MONGODB_PORT}`)

// ######

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var commentRouter = require('./routes/comment');
var likeRouter = require('./routes/like');
var postRouter = require('./routes/post');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(function(req,res,next){  req.db = db;
  next();
});



app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comment',commentRouter);
app.use('/post',postRouter);
app.use('/like',likeRouter);



// catch 404 and forward to error handler
app.use(function(err,req, res, next) {
  console.log(err.message);
  console.log("hello");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log("in the error handler");
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
