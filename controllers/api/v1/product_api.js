const Dealership = require('../../../models/dealership');
const User = require('../../../models/user');
const Testride = require('../../../models/testride');
const Preorder = require('../../../models/preorder');
const testrideConfirmationMailer = require('../../../mailers/testride_confirmation_mailer');
const Razorpay = require('razorpay');
const env = require('../../../config/environment');
const crypto = require('crypto');

//controller for locating dealerships
module.exports.locateDealerships = async function(req, res){
    try {

        //filter the dealerships based on city
        let dealerships = await Dealership.find({city:req.body.city});

        return res.status(200).json({
            message: 'the following dealerships are present at your location',
            data: {
                dealerships: dealerships,
            }
        })

    } catch (error) {
        
        //console error if any
        console.log('Error in locating dealerships: ',error);
        return res.status(500).json({
            message: 'internal server error',
        });
    }
}

//controller for scheduling a testride
module.exports.testride = async function(req, res){
    try {
        
        //locate the dealership
        let dealership = await Dealership.findOne({dealershipName: req.body.dealershipName});

        //locate the user
        let user = await User.findById(req.user.id);

        //if dealership and user found
        if (dealership && user){

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
                message: 'testride scheduled',
                data: {
                    testride: testride,
                }
            });
        }
        //handle unauthorized requests
        else{
            console.log('dealership -->', dealership);
            console.log('user --->', user);
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

    } catch (error) {
        
        //console error if any
        console.log('Error in booking testride: ',error);
        return res.status(500).json({
            message: 'internal server error',
        });
    }
}

//controller for cancelling a testride
module.exports.cancelTestride = async function (req, res){
    try {
        
        //fetch the testride details from database
        let testride = await Testride.findById(req.params.id);

        //fetch the user
        let user = await User.findById(testride.user);
        
        //if testride details and user found
        if(testride && user){

            //check if the testride is valid
            if(testride.isValid){

                //if valid, cancel the booking
                testride.isValid = false;
                testride.save();
                return res.status(200).json({
                    message: 'booking cancelled',
                });
            }else{

                //handle bookings already cancelled
                return res.status(412).json({
                    message: 'booking already cancelled by the user'
                })
            }
        }
        //handle unauthorized requests
        else{
            return res.status(401).json({
                message: 'Unauthorized Access',
            });
        }
    } catch (error) {

        //console error if any
        console.log('Error in booking testride: ',error);
        return res.status(500).json({
            message: 'internal server error',
        });
    }
}

//controller for handling preorders
module.exports.preorder = async function(req, res){
    try {
        //locate the user in database
        let user = await User.findById(req.user.id);
               
        //if user logged found
        if(user){

            //create preorder 
            let preorder = await Preorder.create({
                model: req.body.model,
                color: req.body.color,
                shippingState: req.body.shippingState,
                shippingCity: req.body.shippingCity,
                shippingPincode: req.body.shippingPincode,
                shippingDealershipName: req.body.shippingDealershipName,
                user: user,
                billingAddress: req.body.billingAddress,
                billingLandmark: req.body.billingLandmark,
                billingPincode: req.body.billingPincode,
                billingCity: req.body.billingCity
            });

            return res.status(200).json({
               message: 'order created, complete the payment',
               data: {
                   preorder: preorder,
               } 
            });
        }

        //handle user not 
        else{
            return res.status(401).json({
                message: 'Unauthorized Access',
            });
        }
    } catch (error) {

        //console error if any
        console.log('Error in handling preorders: ', error);
        return res.status(500).json({
            message: 'internal server error',
        });
    }
}

//create an instance of razorpay payment
const razorpayInstance = new Razorpay({
    key_id: env.razorpay_key,
    key_secret: env.razorpay_secret,
});

//controller for generating order details
module.exports.payment = async function(req, res){
    try {

        //define order parameters
        const amount = 2500;
        const currency = 'INR';
        const receipt = crypto.randomBytes(10).toString('hex');
        const payment_capture = 1;

        const options = {
            amount: (amount*100),
            currency,
            receipt,
            payment_capture,
        }

        //instantiate the razorpay order
        const razorpayOrder = await razorpayInstance.orders.create(options);   
    
        return res.status(200).json({
            message: 'payment order created',
            data: razorpayOrder,
        });

    } catch (error) {
        //console error if any
        console.log('Error in generating order details: ', error);
        return res.status(500).json({
            message: 'internal server error',
        });
    }
}

