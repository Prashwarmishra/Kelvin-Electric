const nodemailer = require('../config/nodemailer');

const signUpAccessToken = function(data){

    let htmlString = nodemailer.renderTemplate(data, '/signup/accessToken.ejs');

    nodemailer.transporter.sendMail({
        from: 'product.kelvinelectric@gmail.com',
        to: data.user.email,
        subject: 'Account verification link',
        html: htmlString,
    }, function(err, info){
        if(err){
            console.log('Error in sending user-verification mail');
            return;
        }
        console.log('E-mail sent', info);
        return;
    });
}

module.exports = signUpAccessToken;