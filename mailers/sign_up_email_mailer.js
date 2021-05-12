const nodemailer = require('../config/nodemailer');

exports.signUpAccessToken = function(accessToken){

    let htmlString = nodemailer.renderTemplate({accessToken: accessToken}, '/signup/accessToken.ejs');

    nodemailer.transporter.sendMail({
        from: 'product.kelvinelectric@gmail.com',
        to: accessToken.email,
        subject: 'Account verification link',
        html: htmlString,
    }, function(err, info){
        if(err){
            console.log('Error in sending user-verification mail', err);
            return;
        }
        console.log('E-mail sent', info);
        return;
    });
}
