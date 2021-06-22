const nodemailer = require("../config/nodemailer");

exports.orderCancellationMail = function (preorder, user) {
  const htmlString = nodemailer.renderTemplate(
    { preorder, user },
    "/order/orderCancellation.ejs"
  );

  nodemailer.transporter.sendMail(
    {
      from: "prod.kelvinelectric@gmail.com",
      to: user.email,
      subject: "Order Cancellation Details",
      html: htmlString,
    },
    function (err, info) {
      if (err) {
        console.log("Error in sending testride confirmation mail: ", err);
        return;
      }
      console.log("info", info);
    }
  );
};
