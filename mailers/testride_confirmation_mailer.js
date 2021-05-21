const nodemailer = require('../config/nodemailer');

exports.testrideEmail = function(testride){
    
    const htmlString = nodemailer.renderTemplate({testride: testride}, '/testride//testrideConfirmation.ejs')

    nodemailer.transporter.sendMail({
        from: 'prod.kelvinelectric@gmail.com',
        to: testride.user.email,
        subject: 'Test Ride Confirmation',
        html: htmlString
    }, function(err, info){
        if(err){
            console.log('Error in sending testride confirmation mail: ', err);
            return;
        }
        console.log(info);
    })
}
