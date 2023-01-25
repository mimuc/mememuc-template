var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
const MONGODB_PORT = process.env.DBPORT || '27017';
const db = require('monk')(`127.0.0.1:${MONGODB_PORT}/omm-2223`); // connect to database omm-2021
console.log(`Connected to MongoDB at port ${MONGODB_PORT}`)
// ######

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memesAPI = require('./routes/memesApi');
// var registerUserRouter = require('./routes/registerUser');
var uploadTemplateRouter = require('./routes/uploadTemplate');
var createdMemes = require('./routes/createdMemes');
const session = require('express-session');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(session({
  secret: 'veryverysecretsecretthatshouldberemovedforproduction',
  resave: true,
  cookie: {
    maxAge: 1000*60*60*24*7,
    httpOnly: false,
    secure: false,
  },
  saveUninitialized: true,
}))
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, 'Content-Type' : 'multipart/form-data' ,* "
  );
  res.header(
      "Access-Control-Allow-Methods",
      "GET, POST"
  );
  next();
});
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}
));

app.use(function(req,res,next){
  req.db = db;
  next();
});


// the login middleware. Requires BasicAuth authentication
/*
app.use((req,res,next) => {
  const users = db.get('users');
  users.findOne({basicauthtoken: req.headers.authorization}).then(user => {
    if (user) {
      req.username = user.username;  // test test => Basic dGVzdDp0ZXN0
      next()
    }
    else {
      res.set('WWW-Authenticate', 'Basic realm="401"')
      res.status(401).send()
    }
  }).catch(e => {
    console.error(e)
    res.set('WWW-Authenticate', 'Basic realm="401"')
    res.status(401).send()
  })
})
*/



app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/memesApi', memesAPI);
// app.use('/registerUser', registerUserRouter);
app.use('/uploadTemplate', uploadTemplateRouter);
app.use('/createdMemes', createdMemes);

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
