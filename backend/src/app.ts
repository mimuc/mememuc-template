/* eslint-disable */
// TODO: remove eslint-disable

import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import templateRouter from "./routes/template";

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
const MONGODB_PORT = process.env.DBPORT || "27017";
const db = require("monk")(`127.0.0.1:${MONGODB_PORT}/omm-ws2223`); // connect to database omm-2021
console.log(`Connected to MongoDB at port ${MONGODB_PORT}`);
// ######

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req: any, res, next) {
  req.db = db;
  next();
});

// the login middleware. Requires BasicAuth authentication
// app.use((req: any, res, next) => {
//   const users = db.get("users");
//   users
//     .findOne({ basicauthtoken: req.headers.authorization })
//     .then((user) => {
//       if (user) {
//         req.username = user.username; // test test => Basic dGVzdDp0ZXN0
//         next();
//       } else {
//         res.set("WWW-Authenticate", 'Basic realm="401"');
//         res.status(401).send();
//       }
//     })
//     .catch((e) => {
//       console.error(e);
//       res.set("WWW-Authenticate", 'Basic realm="401"');
//       res.status(401).send();
//     });
// });

app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/template", templateRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));

export default app;
