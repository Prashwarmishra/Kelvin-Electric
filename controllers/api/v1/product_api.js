const Dealership = require('../../../models/dealership');
const User = require('../../../models/user');
const Testride = require('../../../models/testride');

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

//constroller for scheduling a testride
module.exports.testride = async function(req, res){
    try {
        
        //locate the dealership
        let dealership = await Dealership.findOne({name: req.body.dealershipName});

        //locate the user
        let user = await User.findById(req.user.id);

        //if dealership and user found
        if (dealership && user){

            // create a testride record
            let testride = await Testride.create({
                dealershipName: dealership.name,
                date: req.body.date,
                time: req.body.time,
                user: user,
            });

            return res.status(200).json({
                message: 'testride scheduled',
                data: {
                    testride: testride,
                }
            });
        }
        //handle unauthorized requests
        else{
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