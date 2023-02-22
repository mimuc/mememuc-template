var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var mongoose = require("mongoose");
require('dotenv').config();

const {authenticate} = require('./db/authentication');

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
//const MONGODB_PORT = (process.env.DBPORT || '27017').trim();
const MONGODB_PORT = process.env.DBPORT || '27017';
//const db = require('monk')(`127.0.0.1:${MONGODB_PORT}/omm-2223`); // connect to database omm-2021

mongoose.connect(`mongodb://127.0.0.1:${MONGODB_PORT}/omm-ws2223`, () => {
  console.log(`Connected to MongoDB at port ${MONGODB_PORT}`);
});
//const db = mongoose.connection;

/* db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log(`Connected to MongoDB at port ${MONGODB_PORT}`);
}); */

// ######

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var templatesRouter = require('./routes/templates');
var memesRouter = require('./routes/memes');
var resourcesRouter = require('./routes/resources');
var authRouter = require('./routes/auth');
var myRouter = require('./routes/my');

var app = express();

app.use(cors({
  origin: 'http://localhost:3000' // Allow requests from the frontend
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());




// the login middleware. Requires BasicAuth authentication
// app.use((req,res,next) => {
//   const users = db.get('users');
//   users.findOne({basicauthtoken: req.headers.authorization}).then(user => {
//     if (user) {
//       req.userId = user.userId;  // test test => Basic dGVzdDp0ZXN0
//       next()
//     }
//     else {
//       res.set('WWW-Authenticate', 'Basic realm="401"')
//       res.status(401).send()
//     }
//   }).catch(e => {
//     console.error(e)
//     res.set('WWW-Authenticate', 'Basic realm="401"')
//     res.status(401).send()
//   })
// })



app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/templates', templatesRouter);
app.use('/resources', resourcesRouter);
app.use('/auth', authRouter);
app.use('/my', myRouter);

app.use(bodyParser.json());
app.use('/memes', memesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
