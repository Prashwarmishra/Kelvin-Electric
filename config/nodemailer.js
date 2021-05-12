const nodemailer = require('nodemailer');
const env = require('./environment');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport(
    env.smtp
);

const renderTemplate = function(data, relativePath){
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){
                console.log('Error in rendering ejs template:', err);
                return;
            }
            mailHTML = template;
        }        
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate,
};