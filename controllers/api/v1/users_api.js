const User = require('../../../models/user');

module.exports.signUp = async function(req, res){

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
    }else{
        
    }
}