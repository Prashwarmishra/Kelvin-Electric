//initialize the variables
const express = require('express');
const port = 8000;
const passport = require('passport');
const passportJwt = require('./config/passport-jwt-strategy');
const session = require('express-session');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const env = require('./config/environment');

const app = express();

//set up middlewares
app.use(express.urlencoded({extended: true}));

//set up database
const db = require('./config/mongoose');

//set up passport
app.use(session({
    name: 'kelvinElectric',
    secret: env.session_secret,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100),
    }
}));
app.use(passport.initialize());
app.use(passport.session());


//set up routes
app.use('/', require('./routes'));

//start the server
app.listen(port, function(err){
    if(err){
        console.log(`Error in starting the server: ${err}`);
        return;
    }
    console.log(`The server is fired at port: ${port}`);
})