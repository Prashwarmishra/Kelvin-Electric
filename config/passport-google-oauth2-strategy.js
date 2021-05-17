const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
const crypto = require('crypto');
const env = require('./environment');

//create passport strategy
passport.use(new googleStrategy(
    {
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_url,
    }
    , function(accessToken, refreshToken, profile, done){
        //find a user by email
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('error in google login: ', err);
                return done(err);
            }

            //if user found, return user
            if(user){
                return done(null, user);
            }
            //else create a user in database
            else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                }, function(err, user){
                    if(err){
                        console.log('error in creating user:', err);
                        return done(err);
                    }
                    return done(null, user);
                });
            }
        })
    }
));


//serialize only the user id in sessions
passport.serializeUser(function(user, done){
    done(null, user.id);
});


//deserialize user from the id provided
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('error in deserializing user');
            return;
        }
        done(null, user);
    });
});

module.exports = passport;