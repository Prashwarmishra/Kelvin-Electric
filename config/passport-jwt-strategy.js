const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const env = require('./environment');
const User = require('../models/user');

const opts = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret,
}

passport.use(new JwtStrategy(opts, function(JwtPayload, done){
    User.findById(JwtPayload._id, function(err, user){
        if(err){
            console.log('Error in JWT authentication: ', err);
            return done(err);
        }
        if(user){
            return done(null, user);
        }
        return done(null, false);
    });
}));

module.exports = passport;