const nodemailer = require('../config/nodemailer');


exports.passwordResetToken = function(token){

    let htmlString = nodemailer.renderTemplate({token: token}, '/password_reset/passwordResetToken.ejs');

    nodemailer.transporter.sendMail({
        from: 'prod.kelvinelectric@gmail.com',
        to: token.user.email,
        subject: 'Reset your Kelvin Electric account password',
        html: htmlString,
    }, function(err, info){
        if(err){
            console.log('Error in sending password reset email: ', err);
            return;
        }
        console.log(info);
        return;
    })
}