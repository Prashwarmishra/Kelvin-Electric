const nodemailer = require('../config/nodemailer');

exports.orderConfirmationEmail = function(preorder){

    console.log('preorder -------->>>', preorder);

    const htmlString = nodemailer.renderTemplate({preorder: preorder}, '/order/orderConfirmation.ejs');
    console.log('htmlstring---------->', htmlString);

    nodemailer.transporter.sendMail({
        from: 'product.kelvinelectric@gmail.com',
        to: preorder.user.email,
        subject: 'Order confirmation details',
        html: htmlString,
    }, function(err, info){
        if(err){
            console.log('Error in sending the confirmation mail: ', err);
            return;
        }
        console.log(info);
        return;
    });
}