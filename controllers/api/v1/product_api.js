const Dealership = require("../../../models/dealership");
const User = require("../../../models/user");
const Testride = require("../../../models/testride");
const Preorder = require("../../../models/preorder");
const Payment = require("../../../models/payment");
const testrideConfirmationMailer = require("../../../mailers/testride_confirmation_mailer");
const Razorpay = require("razorpay");
const env = require("../../../config/environment");
const crypto = require("crypto");
const orderConfirmationMailer = require("../../../mailers/order_confirmation_mailer");

//controller for locating dealerships
module.exports.locateDealerships = async function (req, res) {
  try {
    //filter the dealerships based on city
    let dealerships = await Dealership.find({});

    return res.status(200).json({
      success: true,
      message: "List of Dealerships:",
      data: {
        dealerships: dealerships,
      },
    });
  } catch (error) {
    //console error if any
    console.log("Error in locating dealerships: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//controller for scheduling a testride
module.exports.testride = async function (req, res) {
  try {
    //locate the dealership
    let dealership = await Dealership.findOne({
      dealershipName: req.body.dealershipName,
    });

    //locate the user
    let user = await User.findById(req.user.id);

    //if dealership and user found
    if (dealership && user) {
      // create a testride record
      let testride = await Testride.create({
        dealershipName: dealership.dealershipName,
        date: req.body.date,
        time: req.body.time,
        user: user,
        isValid: true,
      });

      testrideConfirmationMailer.testrideEmail(testride);

      return res.status(200).json({
        success: true,
        message: "Testride Scheduled",
        data: {
          testride: testride,
        },
      });
    }
    //handle unauthorized requests
    else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    //console error if any
    console.log("Error in booking testride: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//controller for cancelling a testride
module.exports.cancelTestride = async function (req, res) {
  try {
    //fetch the testride details from database
    let testride = await Testride.findById(req.params.id);

    // //fetch the user
    // let user = await User.findById(testride.user);

    //if testride details and user found
    if (testride) {
      //check if the testride is valid
      if (testride.isValid) {
        //if valid, cancel the booking
        testride.isValid = false;
        testride.save();
        return res.status(200).json({
          success: true,
          message: "Booking Cancelled",
        });
      } else {
        //handle bookings already cancelled
        return res.status(412).json({
          success: false,
          message: "Booking already cancelled by the User",
        });
      }
    }
    //handle unauthorized requests
    else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
  } catch (error) {
    //console error if any
    console.log("Error in booking testride: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//create an instance of razorpay payment
const razorpayInstance = new Razorpay({
  key_id: env.razorpay_key,
  key_secret: env.razorpay_secret,
});

//controller for generating order details
module.exports.payment = async function (req, res) {
  try {
    //define order parameters
    const amount = 2500;
    const currency = "INR";
    const receipt = crypto.randomBytes(10).toString("hex");
    const payment_capture = 1;

    const options = {
      amount: amount * 100,
      currency,
      receipt,
      payment_capture,
    };

    //instantiate the razorpay order
    const razorpayOrder = await razorpayInstance.orders.create(options);
    console.log("razorpay order", razorpayOrder);
    return res.status(200).json({
      success: true,
      message: "Payment Order Created",
      data: razorpayOrder,
      key: env.razorpay_key,
    });
  } catch (error) {
    //console error if any
    console.log("Error in generating order details: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//controller for verifying payments
module.exports.paymentVerification = async function (req, res) {
  try {
    //status ok sent so that razorpay does not drop the webhook
    console.log("verification triggered");
    res.json({ status: "ok" });
    const secret = env.razorpay_webhook_secret;

    //create a hash of the secret
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    //if secret matches razorpay-signature, payment is successful
    if (digest === req.headers["x-razorpay-signature"]) {
      //create record for the payment made
      const data = req.body.payload.payment.entity;

      const payment = await Payment.create({
        email: data.email,
        contact: data.contact,
        orderId: data.order_id,
        paymentId: data.id,
        amount: data.amount,
        amountRefunded: data.amount_refunded,
        method: data.method,
        fee: data.fee,
        tax: data.tax,
      });

      console.log(payment);

      console.log("Payment successful");
    }
    //handle unauthorized access
    else {
      console.log("Payment Failed, unauthorized access");
    }
  } catch (error) {
    //console error if any
    console.log("Error in verifying payments: ", error);
  }
};

module.exports.preorder = async function (req, res) {
  try {
    console.log("Placing order");
    const user = await User.findById(req.user.id);

    const payment = await Payment.findOne({
      orderId: req.body.orderId,
      paymentId: req.body.paymentId,
    });

    console.log("Payment details are", payment);

    //if user and payment found
    if (user && payment) {
      //create a preorder
      let preorder = await Preorder.create({
        user: user,
        color: req.body.color,
        shippingCity: req.body.shippingCity,
        shippingDealershipName: req.body.shippingDealershipName,
        shippingAddress: req.body.shippingAddress,
        shippingLandmark: req.body.shippingLandmark,
        payment: payment,
        cancelled: false,
      });

      console.log("preorder record created-----");

      //create preorder record in user schema
      user.preorders.push(preorder.id);
      user.save();

      //send mail to user notifying of order confirmation
      orderConfirmationMailer.orderConfirmationEmail(preorder);

      return res.status(200).json({
        success: true,
        message: "Preorder Record Created!",
        data: {
          preorder: preorder,
        },
      });
    } else {
      //handle unauthorized Access
      console.log("user ---> ", user);
      console.log("payment --->", payment);
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    //console error if any
    console.log("Error in generating order details: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
