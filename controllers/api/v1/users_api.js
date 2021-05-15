const User = require('../../../models/user');
const AccessToken = require('../../../models/access_token');
const crypto = require('crypto');
const signUpEmailMailer = require('../../../mailers/sign_up_email_mailer');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

//create a controller for sign up
module.exports.signUp = async function(req, res){

    try {
        //handle password and confirm password mismatch
        if(req.body.password != req.body.confirm_password){
            return res.status(412).json({
                message: 'password and confirm password does not match, try again.',
            });
        }

        //check if the user already exists in the database
        let user = await User.findOne({email: req.body.email});

        //handle if user already exists by the provided email
        if(user){   
            return res.status(409).json({
                message: 'user account already exists by the provided email.'
            });
        }
        //if no user account exists, create an accesstoken and send verification email
        else{
            let newAccessToken = await AccessToken.create({
                accessToken: crypto.randomBytes(20).toString('hex'),
                isValid: true,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
            });
            
            //send verification email 
            signUpEmailMailer.signUpAccessToken(newAccessToken);

            //return a success message
            return res.status(200).json({
                message: 'User verification link sent, please check your email',
            });
        }
    } catch (error) {

        //in case of error console the error
        console.log('Error in creating user account: ', error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}

//controller to verify the sent mail and create user account
module.exports.verifyAccount = async function(req, res){
    try {
        //find the accessToken in the database
        let accessToken = await AccessToken.findOne({accessToken: req.params.id});

        //if accessToken found and is valid
        if(accessToken && accessToken.isValid){
            
            //create user 
            await User.create({
                name: accessToken.name,
                email: accessToken.email,
                phone: accessToken.phone,
                password: accessToken.password,
            });

            //invalidate the accessToken to restrict further use
            accessToken.isValid = false;
            accessToken.save();

            return res.status(200).json({
                message: 'User account created successfully, please login to continue',
            });
        }

        //if accessToken is not found or invalid return 404
        else{
            return res.status(404).json({
                message: 'File not found',
            }); 
        }
    } catch (error) {
        //in case of error console the error
        console.log('Error in user account verification: ', error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}

//create a controller for signing in users locallly
module.exports.signIn = async function(req, res){
    try {
        //find the user in the database
        let user = await User.findOne({email: req.body.email});

        //handle user not found and password mismatch
        if(!user || user.password != req.body.password){
            return res.status(403).json({
                message: 'Invalid user email/password',
            });
        }
        //if user found, generate the jwt
        else{
            return res.status(200).json({
                message: 'Sign-in successful, here is your json web token',
                data: {
                    //create a jwt token for 24 hours
                    token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '86400000'}),
                }
            });
        }

    } catch (error) {
        //in case of error console the error
        console.log('Error in user sign-in: ', error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}

module.exports.googleSignIn = function(req, res){
    
    return res.status(200).json({
        message: 'Google sign-in successful, here is your token',
        data: {
            data: jwt.sign(req.user.toJSON(), env.jwt_secret, {expiresIn: '86400000'}),
        }
    });
}