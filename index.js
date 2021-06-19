//initialize the variables
const express = require("express");
const port = process.env.PORT || 8000;
const passport = require("passport");
const passportJwt = require("./config/passport-jwt-strategy");
const session = require("express-session");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const env = require("./config/environment");
const bodyParser = require("body-parser");

const app = express();

//fix CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//set up middlewares
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set up database
const db = require("./config/mongoose");

//set up passport
app.use(
  session({
    name: "kelvinElectric",
    secret: env.session_secret,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//set up views
app.set("view engine", "ejs");
app.set("views", "./views");

//set up routes
app.use("/", require("./routes"));

//start the server
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in starting the server: ${err}`);
    return;
  }
  console.log(`The server is fired at port: ${port}`);
});
